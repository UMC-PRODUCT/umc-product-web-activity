import { type ClipboardEvent, type FormEvent, type KeyboardEvent, useEffect, useRef } from 'react';

import { NOTICE_CONTENT_MAX_LENGTH } from '@/entities/notice';
import { cn } from '@/shared/lib/cn';

import { renderEditor, serializeEditor } from '../lib/boldMarkup';
import { BULLET } from '../lib/bullet';

type NoticeContentEditorProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

// 편집 영역이 끝 공백을 줄바꿈 없는 공백으로 바꾸는 경우가 있어 일반 공백으로 되돌려 비교한다
const normalizeSpace = (text: string) => text.replace(/\xa0/g, ' ');

// 커서가 있는 줄(편집 영역 바로 아래 자식)
const getCurrentLine = (root: HTMLElement): HTMLElement | null => {
  let node = window.getSelection()?.anchorNode ?? null;
  while (node && node.parentNode !== root) node = node.parentNode;
  return node instanceof HTMLElement ? node : null;
};

// 줄 맨 앞부터 커서까지 글자 수
const getCaretOffsetInLine = (line: HTMLElement): number => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || !selection.anchorNode) return 0;
  const range = document.createRange();
  range.selectNodeContents(line);
  range.setEnd(selection.anchorNode, selection.anchorOffset);
  return range.toString().length;
};

// 피그마 Web/Notice/Item Content (Type=Edit): 본문 입력 + 글자수. Ctrl+B를 누르면 바로 굵게 보이고, 저장 형식만 **굵게**다. 줄 앞 '- '로 불렛을 넣는다.
const NoticeContentEditor = ({ value, onChange, className }: NoticeContentEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);

  // 줄바꿈은 항상 div로 (줄 단위로 저장 형식을 만들기 위해). jsdom에는 execCommand가 없음
  useEffect(() => {
    if (typeof document.execCommand === 'function') {
      document.execCommand('defaultParagraphSeparator', false, 'div');
    }
  }, []);

  // 밖에서 값이 바뀐 경우(수정 화면에서 기존 공지를 불러올 때)만 화면을 다시 그림. 입력 중에는 커서가 유지되도록 건드리지 않는다
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    if (editor.childElementCount > 0 && serializeEditor(editor) === value) return;
    renderEditor(editor, value);
    if (document.activeElement === editor) {
      window.getSelection()?.collapse(editor.firstChild, 0);
    }
  }, [value]);

  const sync = () => {
    const editor = editorRef.current;
    if (editor) onChange(serializeEditor(editor));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const isBold = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'b';
    if (isBold) {
      event.preventDefault();
      document.execCommand('bold');
      sync();
      return;
    }

    // 한글 조합 중 Enter는 글자 확정이라 건드리지 않는다
    if (event.key !== 'Enter' || event.nativeEvent.isComposing) return;
    event.preventDefault();

    const selection = window.getSelection();
    const line = getCurrentLine(event.currentTarget);
    const text = normalizeSpace(line?.textContent ?? '');
    const inBullet =
      !event.shiftKey &&
      !!line &&
      !!selection?.isCollapsed &&
      text.startsWith(BULLET) &&
      getCaretOffsetInLine(line) >= BULLET.length;

    // 내용이 없는 불렛 줄에서 Enter: 불렛을 지워 목록을 끝낸다
    if (inBullet && line && text.trim() === BULLET.trim()) {
      line.replaceChildren(document.createElement('br'));
      selection?.collapse(line, 0);
      sync();
      return;
    }

    // 불렛 줄에서 Enter: 다음 줄도 불렛으로 시작
    document.execCommand('insertParagraph');
    if (inBullet) document.execCommand('insertText', false, BULLET);
    sync();
  };

  const handleInput = (event: FormEvent<HTMLDivElement>) => {
    // 줄 맨 앞에서 '- ' 를 치면 불렛('· ')으로 바꾼다
    const typedSpace = (event.nativeEvent as InputEvent).data === ' ';
    const selection = window.getSelection();
    const node = selection?.anchorNode;
    // 굵게 처리된 글자 안(<strong>)에서 쳐도 같은 줄의 첫 글자 노드면 바꾼다
    const line = getCurrentLine(event.currentTarget);
    if (
      typedSpace &&
      selection?.isCollapsed &&
      node instanceof Text &&
      line &&
      document.createTreeWalker(line, NodeFilter.SHOW_TEXT).nextNode() === node &&
      selection.anchorOffset === 2 &&
      normalizeSpace(node.data).startsWith('- ')
    ) {
      node.data = BULLET + node.data.slice(2);
      selection.collapse(node, BULLET.length);
    }
    sync();
  };

  // 글자수 제한: 가득 찬 뒤의 입력을 막는다 (한글 조합 중에는 막지 않음)
  const handleBeforeInput = (event: FormEvent<HTMLDivElement>) => {
    const native = event.nativeEvent as InputEvent;
    if (native.isComposing || !native.inputType.startsWith('insert')) return;
    const full = serializeEditor(event.currentTarget).length >= NOTICE_CONTENT_MAX_LENGTH;
    if (full && window.getSelection()?.isCollapsed) event.preventDefault();
  };

  // 서식 없는 글자만 붙여 넣는다
  const handlePaste = (event: ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    const text = event.clipboardData.getData('text/plain').replace(/\r\n?/g, '\n');
    let remaining = NOTICE_CONTENT_MAX_LENGTH - serializeEditor(event.currentTarget).length;
    text.split('\n').forEach((line, index) => {
      if (index > 0 && remaining > 0) {
        document.execCommand('insertParagraph');
        remaining -= 1;
      }
      const chunk = line.slice(0, Math.max(remaining, 0));
      if (chunk) document.execCommand('insertText', false, chunk);
      remaining -= chunk.length;
    });
    sync();
  };

  return (
    <div className={cn('flex flex-col px-8', className)}>
      <div className="flex flex-1 flex-col items-end gap-8 rounded-xl bg-teal-grey-50 px-6 py-5 shadow-inner-neutral-2">
        <div className="relative flex w-full flex-1">
          <div
            ref={editorRef}
            role="textbox"
            aria-multiline
            aria-label="내용"
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onBeforeInput={handleBeforeInput}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            className="min-h-[200px] w-full flex-1 bg-transparent text-body-1-regular leading-[1.6] break-words whitespace-pre-wrap text-teal-grey-900 outline-none [&_div]:min-h-[1.6em]"
          />
          {value === '' && (
            // 안내 문구 안에 굵은 글씨가 있어서 placeholder 대신 겹쳐 보여준다
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 text-body-1-regular leading-[1.6] text-placeholder"
            >
              <p>내용을 입력하세요.</p>
              <p>&nbsp;</p>
              <p>특정 파트에게 전달하는 공지는 제목에 기재해주세요.</p>
              <p>ex. [PM] 프로젝트 등록 관련</p>
              <p>&nbsp;</p>
              <p>
                <strong className="font-bold">Ctrl+B</strong>로{' '}
                <strong className="font-bold">볼드체</strong>를 사용 할 수 있어요
              </p>
            </div>
          )}
        </div>
        <p className="text-body-2-regular text-placeholder">
          {value.length}/{NOTICE_CONTENT_MAX_LENGTH}
        </p>
      </div>
    </div>
  );
};

export default NoticeContentEditor;
