import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import NoticeWriteForm from './NoticeWriteForm';

const renderForm = () => {
  const onBlockedChapterClick = vi.fn();
  render(
    <NoticeWriteForm
      chapters={[
        { id: '1', name: '쿼카' },
        { id: '2', name: '수달', disabled: true },
      ]}
      initialChapterIds={['1']}
      onSubmit={vi.fn()}
      onTitleExceed={vi.fn()}
      onBlockedChapterClick={onBlockedChapterClick}
    />,
  );
  return { onBlockedChapterClick };
};

describe('NoticeWriteForm 지부 선택', () => {
  it('비활성 지부를 누르면 안내하고 선택되지 않는다', async () => {
    const { onBlockedChapterClick } = renderForm();
    const blocked = screen.getByRole('checkbox', { name: '수달' });

    await userEvent.click(blocked);

    expect(onBlockedChapterClick).toHaveBeenCalledTimes(1);
    expect(blocked.getAttribute('aria-checked')).toBe('false');
  });

  it('선택할 수 있는 지부를 누르면 안내하지 않고 선택이 바뀐다', async () => {
    const { onBlockedChapterClick } = renderForm();
    const own = screen.getByRole('checkbox', { name: '쿼카' });

    await userEvent.click(own);

    expect(onBlockedChapterClick).not.toHaveBeenCalled();
    expect(own.getAttribute('aria-checked')).toBe('false');
  });
});
