import { useNavigate, useRouter } from '@tanstack/react-router';
import { Button, ErrorPageContainer } from '@umc-product/react';
import type { ReactNode } from 'react';

import { HOME_PATH } from '@/shared/config/teamMatchingMenu';

const BACKGROUND = [
  'linear-gradient(-63.18deg, rgba(34, 144, 132, 0.03) 10.77%, rgba(255, 255, 255, 0.1) 29.55%)',
  'linear-gradient(121.23deg, rgba(34, 144, 132, 0.05) 5.09%, rgba(255, 255, 255, 0.1) 42.81%)',
  'linear-gradient(rgba(143, 255, 243, 0.08), rgba(143, 255, 243, 0.08))',
  'linear-gradient(#fff, #fff)',
].join(', ');

type ErrorPageProps = {
  title: ReactNode;
  body: ReactNode;
};

const ErrorPage = ({ title, body }: ErrorPageProps) => {
  const router = useRouter();
  const navigate = useNavigate();

  return (
    <main
      className="flex w-full flex-1 items-center justify-center self-stretch px-4 py-20"
      style={{ backgroundImage: BACKGROUND }}
    >
      <ErrorPageContainer
        title={title}
        body={body}
        actions={
          <>
            <Button
              variant="weak"
              size="lg"
              className="w-[150px]"
              onClick={() => router.history.back()}
            >
              이전으로 이동
            </Button>
            <Button size="lg" className="w-[150px]" onClick={() => navigate({ to: HOME_PATH })}>
              홈으로 이동
            </Button>
          </>
        }
      />
    </main>
  );
};

export const NotFoundPage = () => (
  <ErrorPage
    title="페이지를 찾을 수 없어요"
    body={
      <>
        입력한 주소가 잘못되었거나,
        <br />
        페이지가 이동 또는 삭제되었을 수 있어요
      </>
    }
  />
);

export const ServerErrorPage = () => (
  <ErrorPage
    title="일시적인 오류가 발생했어요"
    body={
      <>
        페이지를 불러오지 못했어요
        <br />
        잠시 후 다시 시도해 주세요
      </>
    }
  />
);
