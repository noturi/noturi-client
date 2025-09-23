import { Card, Typography } from '~/shared/ui';

export function StatsHeader() {
  return (
    <Card alignItems="center" backgroundColor="$primary">
      <Typography color="white" variant="title2">
        통계
      </Typography>
      <Typography color="white" marginTop="$0" opacity={0.9} variant="callout">
        나의 별점 기록 분석
      </Typography>
    </Card>
  );
}
