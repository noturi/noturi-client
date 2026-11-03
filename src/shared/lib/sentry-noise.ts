const NOISE_MESSAGE_PATTERN =
  /Network request failed|Failed to fetch|Network Error|Request timed out|\b(canceled|cancelled|aborted)\b/i;
const NOISE_ERROR_NAMES = new Set(['TimeoutError', 'AbortError']);

/** 앱 코드와 무관한 이벤트 — 네트워크 끊김, 타임아웃, 요청 취소 */
export function isNoiseError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return typeof error === 'string' && NOISE_MESSAGE_PATTERN.test(error);
  }
  return NOISE_ERROR_NAMES.has(error.name) || NOISE_MESSAGE_PATTERN.test(error.message);
}
