import { getVisibleRecruitments } from '../../model/getVisibleRecruitments';
import type { AppliedProject, RecruitPart } from '../../model/types';
import RecruitmentList from '../RecruitmentList/RecruitmentList';

// 모집 문항 · 지원서 시트 머리: PE는 플랫폼 이름(Web · Mobile)으로 표기
const PART_LABEL: Record<RecruitPart, string> = {
  DESIGN: 'Design',
  WEB_PE: 'Web',
  MOBILE_PE: 'Mobile',
};

type ProjectRecruitmentSummaryProps = Pick<AppliedProject, 'platform' | 'recruitments'> & {
  description: string;
};

// 피그마 UPMS Description: 프로젝트 소개(왼쪽) + 파트별 모집 현황(오른쪽)
const ProjectRecruitmentSummary = ({
  description,
  platform,
  recruitments,
}: ProjectRecruitmentSummaryProps) => (
  <div className="flex items-start gap-5">
    <p className="flex-1 text-body-1-regular text-teal-grey-600">{description}</p>
    <RecruitmentList
      recruitments={getVisibleRecruitments({ platform, recruitments })}
      partLabels={PART_LABEL}
      className="w-[298px] shrink-0"
    />
  </div>
);

export default ProjectRecruitmentSummary;
