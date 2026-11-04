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
    const cut = findCharBoundary(title, MEMO_TITLE_MAX_LENGTH);
    const overflow = title.substring(cut);
    title = title.substring(0, cut);
    content = overflow + (content ? '\n' + content : '');
  }

  return { title, content };
}

/** 메모를 편집용 단일 텍스트로 합침 (splitMemoText의 역) */
export function joinMemoText(memo: Pick<Memo, 'title' | 'content'>): string {
  return memo.content ? `${memo.title}\n${memo.content}` : memo.title;
}

const isLowSurrogate = (code: number) => code >= 0xdc00 && code <= 0xdfff;

/** 앞 글자에 붙어서 한 글자를 이루는 문자 — 이모지 변형·피부색·키캡·태그(국기)·결합 기호 */
function isExtender(codePoint: number): boolean {
  return (
    codePoint === 0x200d || // ZWJ (👨‍👩‍👧 같은 결합 이모지)
    codePoint === 0xfe0e ||
    codePoint === 0xfe0f || // 이모지 변형 선택자 (❤️)
    codePoint === 0x20e3 || // 키캡 (1️⃣)
    (codePoint >= 0x1f3fb && codePoint <= 0x1f3ff) || // 피부색 (👍🏻)
    (codePoint >= 0xe0020 && codePoint <= 0xe007f) || // 태그 (🏴 지역 깃발)
    (codePoint >= 0x0300 && codePoint <= 0x036f) // 결합 기호
  );
}

const isRegionalIndicator = (codePoint: number) => codePoint >= 0x1f1e6 && codePoint <= 0x1f1ff;

/** index 바로 앞 코드포인트의 시작 위치 */
function prevCodePointStart(text: string, index: number): number {
  return index >= 2 && isLowSurrogate(text.charCodeAt(index - 1)) ? index - 2 : index - 1;
}

/**
 * maxLength(UTF-16 길이) 이하에서 글자가 끊기지 않는 위치
 * - 이모지는 2칸 이상이라 그대로 자르면 반쪽이 깨진 문자(�)로 저장된다
 * - 결합 이모지(👨‍👩‍👧, 👍🏻, 🇰🇷)도 중간에서 자르지 않고 통째로 다음 쪽으로 넘긴다
 */
export function findCharBoundary(text: string, maxLength: number): number {
  if (text.length <= maxLength) return text.length;

  let cut = maxLength;
  if (isLowSurrogate(text.charCodeAt(cut))) cut -= 1;
  const safeCut = cut;

  while (cut > 0) {
    const next = text.codePointAt(cut) ?? 0;
    const prevStart = prevCodePointStart(text, cut);
    const prev = text.codePointAt(prevStart) ?? 0;

    if (isExtender(next) || prev === 0x200d) {
      cut = prevStart;
      continue;
    }
    if (isRegionalIndicator(next) && isRegionalIndicator(prev)) {
      // 국기는 지역 문자 2개가 한 쌍 — 앞쪽 지역 문자 개수가 홀수면 쌍 중간
      let count = 0;
      let i = cut;
      while (i > 0 && isRegionalIndicator(text.codePointAt(prevCodePointStart(text, i)) ?? 0)) {
        count += 1;
        i = prevCodePointStart(text, i);
      }
      if (count % 2 === 1) {
        cut = prevStart;
        continue;
      }
    }
    break;
  }

  // 한 글자가 제한보다 길면(드묾) 코드포인트 경계라도 지킨다
  return cut > 0 ? cut : safeCut;
}
