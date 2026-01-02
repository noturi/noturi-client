import { Card, Typography } from '~/shared/ui';

export function StatsHeader() {
  return (
    <Card className="items-center bg-primary">
      <Typography className="text-white" variant="title2">
        통계
      </Typography>
      <Typography className="text-white opacity-90" variant="callout">
        나의 별점 기록 분석
      </Typography>
    </Card>
  );
}
