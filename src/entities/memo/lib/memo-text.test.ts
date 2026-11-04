import { findCharBoundary, joinMemoText, splitMemoText } from './memo-text';

describe('splitMemoText', () => {
  it('첫 줄은 제목, 나머지는 내용', () => {
    expect(splitMemoText('제목\n내용1\n내용2')).toEqual({ title: '제목', content: '내용1\n내용2' });
  });

  it('첫 줄이 비어 있으면 "제목 없음"', () => {
    expect(splitMemoText('   \n내용')).toEqual({ title: '제목 없음', content: '내용' });
  });

  it('제목이 30자를 넘으면 넘친 부분을 내용 앞으로 옮긴다', () => {
    const longTitle = 'a'.repeat(35);
    expect(splitMemoText(`${longTitle}\n본문`)).toEqual({
      title: 'a'.repeat(30),
      content: 'aaaaa\n본문',
    });
  });

  it('제목만 있고 30자를 넘으면 넘친 부분이 내용이 된다', () => {
    expect(splitMemoText('b'.repeat(32))).toEqual({ title: 'b'.repeat(30), content: 'bb' });
  });
});

describe('splitMemoText — 이모지', () => {
  const hasBrokenChar = (s: string) =>
    /[\ud800-\udbff](?![\udc00-\udfff])|(?<![\ud800-\udbff])[\udc00-\udfff]/.test(s);

  it('30자 경계에 걸린 이모지를 반으로 자르지 않고 내용으로 넘긴다', () => {
    const { title, content } = splitMemoText(`${'가'.repeat(29)}😀 맛있다`);
    expect(title).toBe('가'.repeat(29));
    expect(content).toBe('😀 맛있다');
    expect(hasBrokenChar(title) || hasBrokenChar(content)).toBe(false);
  });

  it.each([
    ['피부색', '👍🏻'],
    ['결합 이모지', '👨‍👩‍👧'],
    ['국기', '🇰🇷'],
    ['변형 선택자', '❤️'],
    ['키캡', '1️⃣'],
  ])('%s 이모지도 통째로 넘긴다', (_, emoji) => {
    for (let pad = 24; pad <= 30; pad++) {
      const text = `${'a'.repeat(pad)}${emoji}끝`;
      const { title, content } = splitMemoText(text);
      expect(title + content).toBe(text);
      // 이모지가 제목이나 내용 한쪽에 통째로 들어 있어야 함 (중간에서 잘리지 않음)
      expect(title.includes(emoji) || content.includes(emoji)).toBe(true);
      expect(hasBrokenChar(title) || hasBrokenChar(content)).toBe(false);
      expect(title.length).toBeLessThanOrEqual(30);
    }
  });

  it('국기가 연달아 있으면 쌍 단위로 자른다', () => {
    const text = `${'a'.repeat(25)}🇰🇷🇯🇵🇺🇸`;
    const cut = findCharBoundary(text, 30);
    // a 25칸 + 국기 하나(4칸) = 29 → 두 번째 국기 중간(31)이 아니라 29에서 자름
    expect(cut).toBe(29);
  });
});

describe('joinMemoText', () => {
  it('내용이 있으면 줄바꿈으로 합친다', () => {
    expect(joinMemoText({ title: '제목', content: '내용' })).toBe('제목\n내용');
  });

  it('내용이 없으면 제목만', () => {
    expect(joinMemoText({ title: '제목', content: '' })).toBe('제목');
  });

  it('split과 왕복 시 원래 값', () => {
    const memo = { title: '영화 후기', content: '재밌었다\n또 보고 싶다' };
    expect(splitMemoText(joinMemoText(memo))).toEqual(memo);
  });
});
