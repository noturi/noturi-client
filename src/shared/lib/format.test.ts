import { convertTo12Hour, convertTo24Hour, formatTimeAgo } from './format';

describe('convertTo24Hour', () => {
  it.each([
    ['12', '00', 'AM', '00:00'],
    ['01', '30', 'AM', '01:30'],
    ['12', '15', 'PM', '12:15'],
    ['02', '45', 'PM', '14:45'],
  ])('%s:%s %s → %s', (hour, minute, ampm, expected) => {
    expect(convertTo24Hour(hour, minute, ampm)).toBe(expected);
  });
});

describe('convertTo12Hour', () => {
  it.each([
    ['00:00', { hour: '12', minute: '00', ampm: 'AM' }],
    ['09:05', { hour: '09', minute: '05', ampm: 'AM' }],
    ['12:30', { hour: '12', minute: '30', ampm: 'PM' }],
    ['23:59', { hour: '11', minute: '59', ampm: 'PM' }],
  ])('%s', (time24, expected) => {
    expect(convertTo12Hour(time24)).toEqual(expected);
  });

  it('convertTo24Hour와 왕복 변환 시 원래 값이 된다', () => {
    const { hour, minute, ampm } = convertTo12Hour('17:20');
    expect(convertTo24Hour(hour, minute, ampm)).toBe('17:20');
  });
});

describe('formatTimeAgo', () => {
  const NOW = new Date('2026-06-15T12:00:00Z');

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(NOW);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const ago = (ms: number) => new Date(NOW.getTime() - ms);

  it('잘못된 날짜는 "-"', () => {
    expect(formatTimeAgo('invalid')).toBe('-');
  });

  it('1분 미만은 "방금 전"', () => {
    expect(formatTimeAgo(ago(30 * 1000))).toBe('방금 전');
  });

  it('분/시간/일 단위', () => {
    expect(formatTimeAgo(ago(5 * 60 * 1000))).toBe('5분 전');
    expect(formatTimeAgo(ago(3 * 60 * 60 * 1000))).toBe('3시간 전');
    expect(formatTimeAgo(ago(2 * 24 * 60 * 60 * 1000))).toBe('2일 전');
  });

  it('ISO 문자열 입력도 처리한다', () => {
    expect(formatTimeAgo(ago(10 * 60 * 1000).toISOString())).toBe('10분 전');
  });

  it('7일 이상은 절대 날짜', () => {
    expect(formatTimeAgo(ago(10 * 24 * 60 * 60 * 1000))).not.toMatch(/전$/);
  });
});
