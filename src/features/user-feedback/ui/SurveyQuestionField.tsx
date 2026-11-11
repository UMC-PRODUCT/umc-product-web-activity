import { FormChoiceList, TextFieldBox } from '@umc-product/react';

import { isTextQuestion, type SurveyAnswer, type SurveyQuestion } from '../model/feedbackForm';
import EmojiChoice from './EmojiChoice';
import FaceScale from './FaceScale';

const TEXT_MAX_LENGTH = 500;

type SurveyQuestionFieldProps = {
  question: SurveyQuestion;
  answer: SurveyAnswer;
  onChange: (answer: SurveyAnswer) => void;
  asList?: boolean;
};

const SurveyQuestionField = ({
  question,
  answer,
  onChange,
  asList = false,
}: SurveyQuestionFieldProps) => {
  const options = (question.options ?? []).flatMap(({ optionId, content }) =>
    optionId === undefined ? [] : [{ optionId, label: content ?? '' }],
  );
  const selectedId = answer.optionIds[0] ?? null;
  const selectOne = (optionId: number) => onChange({ ...answer, optionIds: [optionId] });

  if (isTextQuestion(question)) {
    return (
      <TextFieldBox
        className="w-full"
        aria-label={question.title}
        placeholder={
          question.isRequired ? '자유롭게 작성해 주세요' : '자유롭게 작성해 주세요 (선택)'
        }
        maxLength={TEXT_MAX_LENGTH}
        value={answer.text}
        onChange={(event) => onChange({ ...answer, text: event.target.value })}
      />
    );
  }

  if (!asList && question.type === 'RADIO' && options.length === 5) {
    return (
      <FaceScale
        aria-label={question.title}
        options={options}
        value={selectedId}
        onChange={selectOne}
      />
    );
  }

  if (!asList && question.type === 'RADIO' && options.length === 2) {
    return (
      <EmojiChoice
        aria-label={question.title}
        options={options}
        value={selectedId}
        onChange={selectOne}
      />
    );
  }

  const choiceOptions = options.map(({ optionId, label }) => ({ value: String(optionId), label }));

  if (question.type === 'CHECKBOX') {
    return (
      <FormChoiceList
        type="multiple"
        className="w-full"
        aria-label={question.title}
        options={choiceOptions}
        value={answer.optionIds.map(String)}
        onValueChange={(values) => onChange({ ...answer, optionIds: values.map(Number) })}
      />
    );
  }

  return (
    <FormChoiceList
      type="single"
      className="w-full"
      aria-label={question.title}
      options={choiceOptions}
      value={selectedId === null ? null : String(selectedId)}
      onValueChange={(value) => selectOne(Number(value))}
    />
  );
};

export default SurveyQuestionField;
