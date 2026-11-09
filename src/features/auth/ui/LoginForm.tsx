import { Button, Chip, TextFieldBox } from '@umc-product/react';
import { type FormEvent, useState } from 'react';

import { HOME_PATH } from '@/shared/config/teamMatchingMenu';

import { useEmailLogin } from '../hooks/useEmailLogin';
import { QA_ACCOUNTS } from '../model/qaAccounts';

type LoginFormProps = {
  initialError?: string;
  /** 로그인 후 돌아갈 앱 안 상대 경로 */
  returnTo?: string;
};

// local direct 모드에서만 쓰는 QA 폼. Chip으로 계정을 고르고 SSO `devLogin`으로 이어진다.
const LoginForm = ({ initialError, returnTo = HOME_PATH }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { mutate, isPending, error } = useEmailLogin();

  const errorMessage = error?.message ?? initialError;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutate({ email: email.trim(), password, returnTo });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-[420px] flex-col gap-6 rounded-2xl bg-white p-8 shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
    >
      <div className="flex flex-col gap-1">
        <h1 className="text-heading-4-semibold text-teal-grey-900">QA 임시 로그인</h1>
        <p className="text-body-3-regular text-teal-grey-500">
          로컬 direct 모드에서만 쓰는 화면이에요. 권한을 고르고 비밀번호를 입력해 주세요.
        </p>
      </div>

      {QA_ACCOUNTS.length > 0 && (
        <div className="flex flex-wrap gap-2" role="group" aria-label="권한별 계정">
          {QA_ACCOUNTS.map((account) => (
            <Chip
              key={account.email}
              size="md"
              selected={email === account.email}
              onClick={() => setEmail(account.email)}
            >
              {account.label}
            </Chip>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-4">
        <TextFieldBox
          label="이메일"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <TextFieldBox
          label="비밀번호"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          invalid={Boolean(errorMessage)}
          errorMessage={errorMessage}
          required
        />
      </div>

      <Button type="submit" size="lg" isLoading={isPending} disabled={!email.trim() || !password}>
        로그인
      </Button>
    </form>
  );
};

export default LoginForm;
