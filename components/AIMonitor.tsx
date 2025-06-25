// ROO-AUDIT-TAG :: plan-005-ai-brain.md :: Create AI monitoring interface
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function AIMonitor() {
  const { data: stats, error } = useSWR('/api/ai/stats', fetcher);

  if (error) return <div>Failed to load monitoring data</div>;
  if (!stats) return <div>Loading...</div>;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Lessons Generated
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.lessonsGenerated}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Average Analysis Accuracy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {Math.round(stats.avgAccuracy * 100)}%
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.systemHealth === 'healthy' ? '✅' : '⚠️'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
// ROO-AUDIT-TAG :: plan-005-ai-brain.md :: END