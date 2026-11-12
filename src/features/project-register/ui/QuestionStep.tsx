import {
  closestCenter,
  type CollisionDetection,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  CheckboxIcon,
  CloudUploadIcon,
  FileUploadIcon,
  RadioIcon,
  TextIcon,
  TextLineIcon,
} from '@umc-product/icons';
import {
  FormAttachmentField,
  FormChoiceListEditor,
  FormQuestion,
  FormQuestionEditor,
  FormQuestionToolbar,
  FormQuestionTypeList,
  FormSection,
  FormSectionEmpty,
  FormTextAnswer,
  SectionHeader,
} from '@umc-product/react';
import { type ReactNode, useEffect, useRef, useState } from 'react';

import { changeQuestionType, createQuestion, duplicateQuestion } from '../model/draft';
import { FIXED_NAME_TITLE, FIXED_PORTFOLIO_TITLE } from '../model/fixedQuestions';
import { LONG_ANSWER_MAX_LENGTH, SHORT_ANSWER_MAX_LENGTH } from '../model/limits';
import { parseQuestion, serializeQuestion } from '../model/questionClipboard';
import type {
  ProjectDraft,
  ProjectQuestion,
  QuestionSectionKey,
  QuestionType,
} from '../model/types';

const QUESTION_TYPE_ITEMS: { value: QuestionType; label: string; icon: ReactNode }[] = [
  { value: 'SHORT', label: '주관식', icon: <TextLineIcon /> },
  { value: 'LONG', label: '장문형', icon: <TextIcon /> },
  { value: 'SINGLE', label: '단일선택', icon: <RadioIcon /> },
  { value: 'MULTIPLE', label: '복수 선택', icon: <CheckboxIcon /> },
  { value: 'FILE', label: '파일업로드', icon: <CloudUploadIcon /> },
  { value: 'PORTFOLIO', label: '포트폴리오', icon: <FileUploadIcon /> },
];

const isQuestionType = (value: string): value is QuestionType =>
  QUESTION_TYPE_ITEMS.some((item) => item.value === value);

// 공통 문항 1 · 2번(이름/닉네임, 포트폴리오)은 고정이라 추가 문항은 3번부터 매김
const FIXED_COMMON_QUESTION_COUNT = 2;

// 섹션 영역 자체의 드롭 ID. 문항이 없는 섹션에도 문항을 옮겨 넣을 수 있게 함
const SECTION_DROP_PREFIX = 'section:';
const SECTION_KEYS: QuestionSectionKey[] = ['COMMON', 'DESIGN', 'PE'];

const toSectionDropId = (key: QuestionSectionKey) => `${SECTION_DROP_PREFIX}${key}`;

const formatNumber = (index: number) => String(index).padStart(2, '0');

type MultilineQuestionProps = {
  number: string;
  required: boolean;
  title: string;
  description: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  children: ReactNode;
};

// 디자인 시스템 FormEditableQuestion은 한 줄 input이라 긴 글이 잘림. 같은 클래스(스타일)로 줄바꿈 되는 textarea를 씀
const MultilineQuestion = ({
  number,
  required,
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  children,
}: MultilineQuestionProps) => (
  <div className="umc-form-editable-question">
    <div className="umc-form-editable-question__header">
      <span className="umc-form-editable-question__number">{number}</span>
      <div className="umc-form-editable-question__fields">
        <div className="umc-form-editable-question__title-row">
          <textarea
            rows={1}
            aria-label="질문 제목"
            placeholder="질문을 작성하세요"
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
            className="umc-form-editable-question__title question-editor-textarea"
          />
          {required && (
            <>
              <span className="umc-form-editable-question__required" aria-hidden="true">
                *
              </span>
              <span className="umc-visually-hidden"> (필수)</span>
            </>
          )}
        </div>
        <textarea
          rows={1}
          aria-label="질문 설명"
          placeholder="설명을 적어주세요 (선택 사항)"
          value={description}
          onChange={(event) => onDescriptionChange(event.target.value)}
          className="umc-form-editable-question__description question-editor-textarea"
        />
      </div>
    </div>
    <div className="umc-form-editable-question__answer">{children}</div>
  </div>
);

type QuestionEditorProps = {
  question: ProjectQuestion;
  number: string;
  active: boolean; // 포커스된 문항: 왼쪽 강조선 + 아래에 유형 선택
  onActiveChange: (active: boolean) => void;
  onChange: (question: ProjectQuestion) => void;
  onPasteQuestion: (question: ProjectQuestion) => void; // Ctrl+V로 붙여넣은 문항. 이 문항 아래에 들어감
  onDelete: () => void;
};

// 문항 하나: 질문 · 설명 입력 + 유형별 답변 영역 + 필수 항목 · 삭제. 포커스되면 유형을 바꿀 수 있음
const QuestionEditor = ({
  question,
  number,
  active,
  onActiveChange,
  onChange,
  onPasteQuestion,
  onDelete,
}: QuestionEditorProps) => {
  const { type, title, description, required, choices } = question;
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  return (
    <div
      ref={setNodeRef}
      data-question-id={question.id}
      // 피그마: 편집 카드는 섹션 좌우 끝까지 차고, 강조선이 섹션 왼쪽 끝에 붙음 (섹션 안쪽 여백 20px을 덜어냄)
      className="-mx-5 outline-none"
      style={{ transform: CSS.Translate.toString(transform), transition }}
      // 카드의 빈 곳을 눌러도 카드가 선택되어 Ctrl+C · Ctrl+V가 먹음
      tabIndex={-1}
      onFocus={() => onActiveChange(true)}
      // 입력칸에서 글자를 드래그해 둔 채로는 일반 복사. 그 외에는 문항 카드를 복사
      onCopy={(event) => {
        const { target } = event;
        const hasTextSelected =
          (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) &&
          target.selectionStart !== target.selectionEnd;
        if (hasTextSelected) return;
        event.clipboardData.setData('text/plain', serializeQuestion(question));
        event.preventDefault();
      }}
      // 복사한 문항이 클립보드에 있을 때만 문항으로 붙여넣음. 일반 텍스트는 입력칸에 그대로 붙음
      onPaste={(event) => {
        const copied = parseQuestion(event.clipboardData.getData('text/plain'));
        if (!copied) return;
        event.preventDefault();
        onPasteQuestion(copied);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) onActiveChange(false);
      }}
    >
      <FormQuestionEditor
        active={active}
        toolbar={
          <FormQuestionTypeList
            items={QUESTION_TYPE_ITEMS}
            value={type}
            onValueChange={(next) => {
              if (isQuestionType(next)) onChange(changeQuestionType(question, next));
            }}
          />
        }
        dragging={isDragging}
        dragHandleProps={{ ref: setActivatorNodeRef, ...attributes, ...listeners }}
        required={required}
        onRequiredChange={(next) => onChange({ ...question, required: next })}
        onDelete={onDelete}
      >
        <MultilineQuestion
          number={number}
          required={required}
          title={title}
          description={description}
          onTitleChange={(value) => onChange({ ...question, title: value })}
          onDescriptionChange={(value) => onChange({ ...question, description: value })}
        >
          {(type === 'SHORT' || type === 'LONG') && (
            <FormTextAnswer
              className="form-answer-preview"
              disabled
              placeholder="작성하세요"
              maxLength={type === 'SHORT' ? SHORT_ANSWER_MAX_LENGTH : LONG_ANSWER_MAX_LENGTH}
            />
          )}
          {(type === 'SINGLE' || type === 'MULTIPLE') && (
            <FormChoiceListEditor
              type={type === 'SINGLE' ? 'single' : 'multiple'}
              options={choices}
              onOptionChange={(id, label) =>
                onChange({
                  ...question,
                  choices: choices.map((choice) =>
                    choice.id === id ? { ...choice, label } : choice,
                  ),
                })
              }
              onOptionAdd={() =>
                onChange({
                  ...question,
                  choices: [...choices, { id: crypto.randomUUID(), label: '' }],
                })
              }
              onOptionRemove={(id) =>
                onChange({ ...question, choices: choices.filter((choice) => choice.id !== id) })
              }
            />
          )}
          {(type === 'FILE' || type === 'PORTFOLIO') && <FormAttachmentField disabled />}
        </MultilineQuestion>
      </FormQuestionEditor>
    </div>
  );
};

type QuestionListProps = {
  sectionKey: QuestionSectionKey;
  questions: ProjectQuestion[];
  startNumber: number;
  showEmpty?: boolean; // 문항이 없을 때 빈 안내를 보여줄지 (선택 섹션)
  onQuestionDeleted: (undo: () => void) => void; // 삭제 안내(토스트)는 화면에서 띄움
  onChange: (questions: ProjectQuestion[]) => void;
};

const QuestionList = ({
  sectionKey,
  questions,
  startNumber,
  showEmpty,
  onQuestionDeleted,
  onChange,
}: QuestionListProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [toolbarOpen, setToolbarOpen] = useState(false);
  const focusIdRef = useRef<string | null>(null);
  // 되돌리기는 토스트가 떠 있는 동안 눌리므로 그 시점의 최신 목록을 써야 함
  const latest = useRef({ questions, onChange });
  useEffect(() => {
    latest.current = { questions, onChange };
  });

  const { setNodeRef } = useDroppable({ id: toSectionDropId(sectionKey) });

  // 새로 추가한 문항은 바로 질문을 쓸 수 있게 포커스
  useEffect(() => {
    const id = focusIdRef.current;
    if (!id) return;
    focusIdRef.current = null;
    document.querySelector<HTMLElement>(`[data-question-id="${id}"] textarea`)?.focus();
  }, [questions]);

  // 붙여넣은 문항은 선택한 문항 바로 아래에 붙고, 바로 질문을 고칠 수 있게 포커스
  const handlePasteQuestion = (copied: ProjectQuestion, index: number) => {
    const copy = duplicateQuestion(copied);
    const next = [...questions];
    next.splice(index + 1, 0, copy);
    onChange(next);
    setActiveId(copy.id);
    focusIdRef.current = copy.id;
  };

  const handleDelete = (question: ProjectQuestion, index: number) => {
    onChange(questions.filter((item) => item.id !== question.id));
    onQuestionDeleted(() => {
      const current = latest.current.questions;
      if (current.some((item) => item.id === question.id)) return;
      const next = [...current];
      next.splice(Math.min(index, next.length), 0, question);
      latest.current.onChange(next);
    });
  };

  return (
    <div ref={setNodeRef} className="flex flex-col">
      {showEmpty && questions.length === 0 && (
        <div className="mb-6">
          <FormSectionEmpty />
        </div>
      )}
      <SortableContext items={questions.map(({ id }) => id)} strategy={verticalListSortingStrategy}>
        {questions.map((question, index) => (
          <QuestionEditor
            key={question.id}
            question={question}
            number={formatNumber(startNumber + index)}
            active={activeId === question.id}
            onActiveChange={(active) =>
              setActiveId((current) =>
                active ? question.id : current === question.id ? null : current,
              )
            }
            onChange={(next) =>
              onChange(questions.map((item) => (item.id === next.id ? next : item)))
            }
            onPasteQuestion={(copied) => handlePasteQuestion(copied, index)}
            onDelete={() => handleDelete(question, index)}
          />
        ))}
      </SortableContext>
      {/* 피그마: 문항을 편집 중일 때는 그 문항의 유형 선택만 보이고, 아니면 + 버튼 */}
      {/* 문항 카드끼리는 붙고, 유형 선택(+)만 위와 간격을 둠 */}
      {activeId === null && (
        <div className="mt-6 first:mt-0">
          <FormQuestionToolbar
            items={QUESTION_TYPE_ITEMS}
            open={toolbarOpen}
            onOpenChange={setToolbarOpen}
            onTypeSelect={(value) => {
              if (!isQuestionType(value)) return;
              const created = createQuestion(value);
              onChange([...questions, created]);
              setToolbarOpen(false);
              setActiveId(created.id);
              focusIdRef.current = created.id;
            }}
          />
        </div>
      )}
    </div>
  );
};

type QuestionStepProps = {
  draft: ProjectDraft;
  onChange: (patch: Partial<ProjectDraft>) => void;
  pePlatformLabel: string; // 2단계에서 고른 PE 플랫폼 (예: Web PE)
  onQuestionDeleted: (undo: () => void) => void;
};

// 3단계 지원 문항: 05 프로젝트 지원 문항 설정 (공통 문항 + Design · PE 선택 섹션)
const QuestionStep = ({
  draft,
  onChange,
  pePlatformLabel,
  onQuestionDeleted,
}: QuestionStepProps) => {
  const setQuestions = (key: QuestionSectionKey, questions: ProjectQuestion[]) =>
    onChange({ questions: { ...draft.questions, [key]: questions } });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const findSection = (id: string | number) =>
    SECTION_KEYS.find((key) => draft.questions[key].some((question) => question.id === id));

  // 포인터가 있는 섹션을 먼저 찾고, 그 섹션 안에서 가장 가까운 문항을 고름 (비어 있으면 섹션 자체)
  const collisionDetection: CollisionDetection = (args) => {
    const isSection = (id: string | number) => String(id).startsWith(SECTION_DROP_PREFIX);
    const [sectionHit] = pointerWithin({
      ...args,
      droppableContainers: args.droppableContainers.filter(({ id }) => isSection(id)),
    });
    if (!sectionHit) return closestCenter(args);
    const key = String(sectionHit.id).slice(SECTION_DROP_PREFIX.length) as QuestionSectionKey;
    const inSection = args.droppableContainers.filter(
      ({ id }) => !isSection(id) && draft.questions[key].some((question) => question.id === id),
    );
    return inSection.length === 0
      ? [sectionHit]
      : closestCenter({ ...args, droppableContainers: inSection });
  };

  // 같은 섹션 안에서는 순서만, 다른 섹션으로 놓으면 그 섹션으로 문항을 옮김
  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const from = findSection(active.id);
    if (!from) return;
    const overId = String(over.id);
    const to = overId.startsWith(SECTION_DROP_PREFIX)
      ? (overId.slice(SECTION_DROP_PREFIX.length) as QuestionSectionKey)
      : findSection(over.id);
    if (!to) return;
    // 꺼 둔 선택 섹션으로는 옮길 수 없음
    if (to !== 'COMMON' && !draft.sectionEnabled[to]) return;

    const fromIndex = draft.questions[from].findIndex(({ id }) => id === active.id);
    const overIndex = draft.questions[to].findIndex(({ id }) => id === over.id);
    if (from === to) {
      if (overIndex < 0) return;
      setQuestions(from, arrayMove(draft.questions[from], fromIndex, overIndex));
      return;
    }
    const target = [...draft.questions[to]];
    target.splice(overIndex < 0 ? target.length : overIndex, 0, draft.questions[from][fromIndex]);
    onChange({
      questions: {
        ...draft.questions,
        [from]: draft.questions[from].filter(({ id }) => id !== active.id),
        [to]: target,
      },
    });
  };

  const setEnabled = (key: 'DESIGN' | 'PE', enabled: boolean) =>
    onChange({ sectionEnabled: { ...draft.sectionEnabled, [key]: enabled } });

  return (
    <DndContext sensors={sensors} collisionDetection={collisionDetection} onDragEnd={handleDragEnd}>
      <div className="flex flex-col gap-6">
        <SectionHeader
          number="05"
          title="프로젝트 지원 문항 설정"
          description="챌린저들이 프로젝트 지원 시 작성할 폼을 설정해주세요. 합격 결과를 전달할 수단도 포함 할 수 있어요."
        />
        <div className="flex flex-col gap-6">
          <FormSection title="공통 문항">
            <div className="flex flex-col gap-10 px-5 pt-8 pb-6">
              <FormQuestion number="01" title={FIXED_NAME_TITLE} required>
                <FormTextAnswer
                  disabled
                  placeholder="작성하세요"
                  maxLength={SHORT_ANSWER_MAX_LENGTH}
                />
              </FormQuestion>
              <FormQuestion number="02" title={FIXED_PORTFOLIO_TITLE} required>
                <FormAttachmentField disabled />
              </FormQuestion>
              <QuestionList
                sectionKey="COMMON"
                onQuestionDeleted={onQuestionDeleted}
                questions={draft.questions.COMMON}
                startNumber={FIXED_COMMON_QUESTION_COUNT + 1}
                onChange={(questions) => setQuestions('COMMON', questions)}
              />
            </div>
          </FormSection>

          <FormSection
            variant="toggle"
            title="Design"
            optionalLabel="(선택 사항)"
            enabledLabel="섹션 사용"
            enabled={draft.sectionEnabled.DESIGN}
            onEnabledChange={(enabled) => setEnabled('DESIGN', enabled)}
          >
            {/* 문항이 있으면 섹션 제목 바로 아래에 첫 문항 카드가 붙음 */}
            <div className={`px-5 pb-6 ${draft.questions.DESIGN.length > 0 ? '' : 'pt-8'}`}>
              <QuestionList
                sectionKey="DESIGN"
                onQuestionDeleted={onQuestionDeleted}
                questions={draft.questions.DESIGN}
                startNumber={1}
                onChange={(questions) => setQuestions('DESIGN', questions)}
              />
            </div>
          </FormSection>

          <FormSection
            variant="toggle"
            title={`${pePlatformLabel} Product Engineering`}
            optionalLabel="(선택 사항)"
            enabledLabel="섹션 사용"
            enabled={draft.sectionEnabled.PE}
            onEnabledChange={(enabled) => setEnabled('PE', enabled)}
          >
            {/* 문항이 있으면 섹션 제목 바로 아래에 첫 문항 카드가 붙음 */}
            <div className={`px-5 pb-6 ${draft.questions.PE.length > 0 ? '' : 'pt-8'}`}>
              <QuestionList
                sectionKey="PE"
                onQuestionDeleted={onQuestionDeleted}
                questions={draft.questions.PE}
                startNumber={1}
                onChange={(questions) => setQuestions('PE', questions)}
              />
            </div>
          </FormSection>

          <ul className="flex flex-col text-caption-2-regular text-teal-grey-500">
            <li>* 지원자의 파트에 따라 해당하는 섹션의 질문만 노출돼요.</li>
            <li>
              * 개발(Web PE/Mobile PE) 섹션의 문항은 기획-개발자 매칭 전 다시 수정할 수 있어요.
            </li>
          </ul>
        </div>
      </div>
    </DndContext>
  );
};

export default QuestionStep;
