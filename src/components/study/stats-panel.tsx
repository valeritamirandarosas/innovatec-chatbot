
'use client';

import { Flame, Star, Timer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { InnovatecUser } from '@/lib/types';
import { LeaderboardDialog } from './leaderboard-dialog';

type StatsPanelProps = {
  user: InnovatecUser | null;
};

const StatItem = ({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color?: string;
}) => {
  const Icon = icon;
  return (
    <div className="flex flex-col items-center justify-center gap-1 text-center">
      <Icon className={`h-6 w-6 ${color || 'text-muted-foreground'}`} />
      <span className="text-xl font-bold">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
};

export function StatsPanel({ user }: StatsPanelProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">Tu Progreso</CardTitle>
        <LeaderboardDialog />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-center">
          <StatItem
            icon={Star}
            label="Puntaje"
            value={user?.score ?? 0}
            color="text-yellow-400"
          />
          <StatItem
            icon={Flame}
            label="Racha"
            value={`${user?.streak ?? 0} días`}
            color="text-orange-400"
          />
          <StatItem
            icon={Timer}
            label="Minutos"
            value={user?.minutesStudied ?? 0}
            color="text-blue-400"
          />
        </div>
      </CardContent>
    </Card>
  );
}
