import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

import { getManagedProjects } from './getManagedProjects';

type BaseParams = {
  gisuId: number;
  chapterId?: number;
  keyword?: string;
  size?: number;
  sort?: string[];
};

export const managedProjectsInfiniteQueryOptions = (params: BaseParams) =>
  infiniteQueryOptions({
    queryKey: ['managed-projects', params],
    queryFn: ({ pageParam }) => getManagedProjects({ ...params, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: params.gisuId > 0,
  });

export const managedProjectsQueryOptions = (params: BaseParams & { page: number }) =>
  queryOptions({
    queryKey: ['managed-projects', params],
    queryFn: () => getManagedProjects(params),
    enabled: params.gisuId > 0,
  });
