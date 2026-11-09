import { queryOptions } from '@tanstack/react-query';

import { getManagedProjects } from './getManagedProjects';

type BaseParams = {
  gisuId: number;
  chapterId?: number;
  keyword?: string;
  size?: number;
  sort?: string[];
};

export const managedProjectsQueryOptions = (params: BaseParams & { page: number }) =>
  queryOptions({
    queryKey: ['managed-projects', params],
    queryFn: () => getManagedProjects(params),
    enabled: params.gisuId > 0,
  });
