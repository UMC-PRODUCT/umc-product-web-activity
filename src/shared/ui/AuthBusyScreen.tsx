type AuthBusyScreenProps = {
  /** 스크린리더용 상태 문구. 화면에는 스피너만 보인다. */
  label?: string;
};

/** 로그인/콜백 대기 화면. DS Spinner가 없어 brand 색 스피너를 둔다. */
const AuthBusyScreen = ({ label = '로그인 중' }: AuthBusyScreenProps) => (
  <main className="flex min-h-dvh flex-1 items-center justify-center bg-teal-grey-50 px-4 py-20">
    <div aria-live="polite" className="inline-flex items-center justify-center" role="status">
      <span className="sr-only">{label}</span>
      <span
        aria-hidden
        className="size-8 animate-spin rounded-full border-2 border-teal-grey-200 border-t-teal-500"
      />
    </div>
  </main>
);

export default AuthBusyScreen;
