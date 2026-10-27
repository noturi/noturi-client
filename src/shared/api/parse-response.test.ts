import { z } from 'zod';
import Logger from '~/shared/lib/logger';

import { parseResponse } from './parse-response';

const schema = z.object({ id: z.string(), count: z.number() });

describe('parseResponse', () => {
  it('스키마에 맞으면 파싱된 값을 반환한다', () => {
    expect(parseResponse(schema, { id: 'a', count: 1 }, 'test')).toEqual({ id: 'a', count: 1 });
  });

  it('불일치 시 에러를 로그하고 원본을 그대로 반환한다 (앱 중단 방지)', () => {
    const spy = jest.spyOn(Logger, 'error').mockImplementation(() => {});
    const raw = { id: 1, count: 'x' };

    expect(parseResponse(schema, raw, 'GET test')).toBe(raw);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('GET test'), expect.any(Array));

    spy.mockRestore();
  });
});
