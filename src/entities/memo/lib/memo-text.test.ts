import { joinMemoText, splitMemoText } from './memo-text';

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
