import { FormQuestion, FormSection } from '@umc-product/react';
import { useEffect, useState } from 'react';

import {
  type AnswerDrafts,
  type ApplyFormSection,
  EMPTY_ANSWER,
  getSortedQuestions,
  uploadApplicationFile,
} from '@/features/applications';

import ApplyQuestionField from '../-apply/ApplyQuestionField';

const FILE_REJECT_MESSAGE = {
  type: 'PDF 파일만 올릴 수 있어요.',
  size: '파일은 200MB 이하만 올릴 수 있어요.',
} as const;

type EditApplicationSectionsProps = {
  sections: ApplyFormSection[];
  drafts: AnswerDrafts;
  onDraftsChange: (update: (prev: AnswerDrafts) => AnswerDrafts) => void;
  onUploadingChange: (uploading: boolean) => void;
};

const EditApplicationSections = ({
  sections,
  drafts,
  onDraftsChange,
  onUploadingChange,
}: EditApplicationSectionsProps) => {
  const [uploadingIds, setUploadingIds] = useState<number[]>([]);
  const [fileErrors, setFileErrors] = useState<Record<number, string>>({});

  const isUploading = uploadingIds.length > 0;
  useEffect(() => onUploadingChange(isUploading), [isUploading, onUploadingChange]);

  const handleFileSelect = async (questionId: number, file: File) => {
    setFileErrors(({ [questionId]: _removed, ...rest }) => rest);
    setUploadingIds((prev) => [...prev, questionId]);
    try {
      const fileId = await uploadApplicationFile(file);
      onDraftsChange((prev) => ({
        ...prev,
        [questionId]: { ...(prev[questionId] ?? EMPTY_ANSWER), file: { fileId, name: file.name } },
      }));
    } catch (error) {
      setFileErrors((prev) => ({
        ...prev,
        [questionId]: error instanceof Error ? error.message : '파일을 올리지 못했어요.',
      }));
    } finally {
      setUploadingIds((prev) => prev.filter((id) => id !== questionId));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {sections.map((section) => (
        <FormSection
          key={section.sectionId}
          variant="toggle"
          title={section.title}
          className="[&_.umc-form-section\_\_switch]:hidden"
        >
          <div className="flex flex-col">
            {getSortedQuestions(section).map((question, index) => {
              const { questionId } = question;
              if (questionId === undefined) return null;
              return (
                <div key={questionId} className="pt-8 pr-6 pb-[38px] pl-5">
                  <FormQuestion
                    number={String(index + 1).padStart(2, '0')}
                    title={question.title}
                    description={question.description}
                    required={question.isRequired}
                  >
                    <ApplyQuestionField
                      question={question}
                      draft={drafts[questionId] ?? EMPTY_ANSWER}
                      isUploading={uploadingIds.includes(questionId)}
                      fileError={fileErrors[questionId]}
                      onChange={(draft) =>
                        onDraftsChange((prev) => ({ ...prev, [questionId]: draft }))
                      }
                      onFileSelect={(file) => handleFileSelect(questionId, file)}
                      onFileReject={(reason) =>
                        setFileErrors((prev) => ({
                          ...prev,
                          [questionId]: FILE_REJECT_MESSAGE[reason],
                        }))
                      }
                    />
                  </FormQuestion>
                </div>
              );
            })}
          </div>
        </FormSection>
      ))}
    </div>
  );
};

export default EditApplicationSections;
