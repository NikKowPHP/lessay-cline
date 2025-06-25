// ROO-AUDIT-TAG :: plan-004-progress-tracking.md :: Implement dashboard layout
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Chart } from 'chart.js';
import { useEffect, useRef } from 'react';
import useSWR from 'swr';

// ROO-AUDIT-TAG :: plan-004-progress-tracking.md :: Implement dashboard data fetching
type ProgressEntry = {
  createdAt: string;
  _avg: {
    overallScore: number;
    fluencyScore: number;
    grammarScore: number;
    vocabularyScore: number;
  };
};

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Dashboard() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const { data, error, isLoading } = useSWR('/api/stats/progress', fetcher);

  useEffect(() => {
    if (chartRef.current && data) {
      const chartData = {
        labels: data.map((entry: ProgressEntry) =>
          new Date(entry.createdAt).toLocaleDateString()
        ),
        datasets: [{
          label: 'Overall Progress',
          data: data.map((entry: ProgressEntry) => entry._avg.overallScore * 100),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      };

      new Chart(chartRef.current, {
        type: 'line',
        data: chartData,
        options: {
          scales: {
            y: {
              min: 0,
              max: 100
            }
          }
        }
      });
    }
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Failed to load data</div>;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Skill Mastery
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data?.length ? `${(data[data.length - 1]._avg.overallScore * 100).toFixed(1)}%` : 'N/A'}
          </div>
          <canvas ref={chartRef} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Fluency Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data?.length ? `${(data[data.length - 1]._avg.fluencyScore * 100).toFixed(1)}%` : 'N/A'}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            SRS Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data?.length ? `${(data[data.length - 1]._avg.grammarScore * 100).toFixed(1)}%` : 'N/A'}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Error Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data?.length ? `${(data[data.length - 1]._avg.vocabularyScore * 100).toFixed(1)}%` : 'N/A'}
          </div>
        </CardContent>
      </Card>
      </div>

      {/* ROO-AUDIT-TAG :: plan-004-progress-tracking.md :: Implement activity log component */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Activity Log
          </CardTitle>
          <div className="flex gap-2">
            <select className="text-sm p-1 border rounded">
              <option>All Activities</option>
              <option>Lessons</option>
              <option>Reviews</option>
              <option>Assessments</option>
            </select>
            <input type="date" className="text-sm p-1 border rounded" />
            <input type="date" className="text-sm p-1 border rounded" />
            {/* ROO-AUDIT-TAG :: plan-004-progress-tracking.md :: Add export button */}
            <button
              className="text-sm px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={async () => {
                const response = await fetch('/api/stats/export');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'progress-data.csv';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
              }}
            >
              Export CSV
            </button>
            {/* ROO-AUDIT-TAG :: plan-004-progress-tracking.md :: END */}
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm">
                  <th className="p-2">Date</th>
                  <th className="p-2">Activity</th>
                  <th className="p-2">Score</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((entry: ProgressEntry) => (
                  <tr key={entry.createdAt} className="border-t">
                    <td className="p-2">{new Date(entry.createdAt).toLocaleDateString()}</td>
                    <td className="p-2">Lesson</td>
                    <td className="p-2">{(entry._avg.overallScore * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      {/* ROO-AUDIT-TAG :: plan-004-progress-tracking.md :: END */}
    </div>
  );
}
// ROO-AUDIT-TAG :: plan-004-progress-tracking.md :: END