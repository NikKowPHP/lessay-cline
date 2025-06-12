import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface FluencyData {
  createdAt: string;
  _avg: {
    accuracyScore: number;
  };
  _count: {
    _all: number;
  };
}

interface SRSOverview {
  exerciseType: string;
  _count: {
    status: number;
  };
  _min: {
    nextReview: string;
  };
  _max: {
    nextReview: string;
  };
  _avg: {
    nextReview: string;
  };
}

interface RecentActivity {
  id: string;
  type: string;
  date: string;
  details: string;
}

const DashboardView = () => {
  const [fluencyStats, setFluencyStats] = useState<FluencyData[]>([]);
  const [srsOverview, setSrsOverview] = useState<SRSOverview[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fluencyRes, srsRes] = await Promise.all([
          fetch('/api/stats/fluency'),
          fetch('/api/stats/srs-overview')
        ]);

        if (!fluencyRes.ok || !srsRes.ok) {
          throw new Error('Failed to fetch stats');
        }

        const fluencyData = await fluencyRes.json();
        const srsData = await srsRes.json();

        setFluencyStats(fluencyData.overview);
        setSrsOverview(srsData.overview);
        setRecentActivity([]); // TODO: Fetch real recent activity data
        setLoading(false);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4 space-y-8">
      <h1 className="text-2xl font-bold">Learning Dashboard</h1>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl mb-4">Accuracy Trends</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={fluencyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="createdAt" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="_avg.accuracyScore"
                stroke="#8884d8"
                name="Average Accuracy"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl mb-4">SRS Status Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={srsOverview}
                  dataKey="_count.status"
                  nameKey="exerciseType"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {srsOverview.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl mb-4">Recent Activity</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left">Type</th>
                  <th className="text-left">Date</th>
                  <th className="text-left">Details</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((activity) => (
                  <tr key={activity.id}>
                    <td>{activity.type}</td>
                    <td>{activity.date}</td>
                    <td>{activity.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;