/**
 * 버전 문자열을 비교합니다.
 * @returns -1: a < b, 0: a === b, 1: a > b
 */
export function compareVersions(a: string, b: string): number {
  const partsA = a.split('.').map(Number);
  const partsB = b.split('.').map(Number);

  const maxLength = Math.max(partsA.length, partsB.length);

  for (let i = 0; i < maxLength; i++) {
    const numA = partsA[i] || 0;
    const numB = partsB[i] || 0;

    if (numA < numB) return -1;
    if (numA > numB) return 1;
  }

  return 0;
}

/**
 * 현재 버전이 최소 버전보다 낮은지 확인합니다. (강제 업데이트 필요)
 */
export function needsForceUpdate(currentVersion: string, minVersion: string): boolean {
  return compareVersions(currentVersion, minVersion) < 0;
}

/**
 * 현재 버전이 최신 버전보다 낮은지 확인합니다. (선택적 업데이트)
 */
export function hasNewVersion(currentVersion: string, latestVersion: string): boolean {
  return compareVersions(currentVersion, latestVersion) < 0;
}
