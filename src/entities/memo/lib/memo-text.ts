import type { Memo } from '../model/types';

export const MEMO_TITLE_MAX_LENGTH = 30;

/**
 * 입력 텍스트를 제목/내용으로 분리
 * - 첫 줄은 제목, 나머지는 내용
 * - 제목이 최대 길이를 넘으면 넘친 부분은 내용 앞으로 이동
 */
export function splitMemoText(text: string): { title: string; content: string } {
  const lines = text.split('\n');
  let title = lines[0].trim() || '제목 없음';
  let content = lines.slice(1).join('\n').trim();

  if (title.length > MEMO_TITLE_MAX_LENGTH) {
    const overflow = title.substring(MEMO_TITLE_MAX_LENGTH);
    title = title.substring(0, MEMO_TITLE_MAX_LENGTH);
    content = overflow + (content ? '\n' + content : '');
  }

  return { title, content };
}

/** 메모를 편집용 단일 텍스트로 합침 (splitMemoText의 역) */
export function joinMemoText(memo: Pick<Memo, 'title' | 'content'>): string {
  return memo.content ? `${memo.title}\n${memo.content}` : memo.title;
}
