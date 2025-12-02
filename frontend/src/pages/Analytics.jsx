import { useState, useEffect } from 'react';
import { API_URL } from '../config';

function Analytics() {
  const [stats, setStats] = useState({});
  const [readingData, setReadingData] = useState([]);
  const [genreData, setGenreData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('year');

  useEffect(() => {
    fetchAnalytics();
  }, [timeframe]);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const [statsRes, readingRes, genreRes] = await Promise.all([
        fetch(`${API_URL}/api/analytics/stats?timeframe=${timeframe}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_URL}/api/analytics/reading-progress?timeframe=${timeframe}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_URL}/api/analytics/genres`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (readingRes.ok) setReadingData(await readingRes.json());
      if (genreRes.ok) setGenreData(await genreRes.json());
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl text-gray-600">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Reading Analytics</h1>
            <p className="text-gray-600">Insights into your reading habits and progress</p>
          </div>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-900">{stats.booksCompleted || 0}</div>
              <div className="text-gray-600">Books Completed</div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
          {stats.completionRate && (
            <div className="mt-2 text-sm text-green-600">
              {stats.completionRate}% completion rate
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-900">{stats.pagesRead || 0}</div>
              <div className="text-gray-600">Pages Read</div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📖</span>
            </div>
          </div>
          {stats.avgPagesPerDay && (
            <div className="mt-2 text-sm text-blue-600">
              {stats.avgPagesPerDay} pages/day avg
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-900">{stats.readingTime || 0}</div>
              <div className="text-gray-600">Hours Read</div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⏰</span>
            </div>
          </div>
          {stats.avgSessionTime && (
            <div className="mt-2 text-sm text-purple-600">
              {stats.avgSessionTime} min avg session
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-900">{stats.readingStreak || 0}</div>
              <div className="text-gray-600">Day Streak</div>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🔥</span>
            </div>
          </div>
          {stats.longestStreak && (
            <div className="mt-2 text-sm text-orange-600">
              {stats.longestStreak} days longest
            </div>
          )}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Reading Progress Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Reading Progress</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {readingData.slice(0, 12).map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-indigo-600 to-purple-600 rounded-t-lg min-h-[4px]"
                  style={{ height: `${(data.books / Math.max(...readingData.map(d => d.books))) * 200}px` }}
                ></div>
                <div className="text-xs text-gray-600 mt-2 transform -rotate-45 origin-left">
                  {data.period}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Genre Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Favorite Genres</h3>
          <div className="space-y-4">
            {genreData.slice(0, 8).map((genre, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600"></div>
                  <span className="text-gray-700 font-medium">{genre.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full"
                      style={{ width: `${(genre.count / genreData[0]?.count) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">{genre.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reading Goals */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Reading Goals</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 relative">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(stats.yearlyProgress || 0) * 2.51} 251`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-900">
                  {Math.round(stats.yearlyProgress || 0)}%
                </span>
              </div>
            </div>
            <div className="text-gray-600">Yearly Goal</div>
            <div className="text-sm text-gray-500">
              {stats.booksCompletedThisYear || 0} of {stats.yearlyGoal || 12} books
            </div>
          </div>

          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 relative">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="url(#gradient2)"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(stats.monthlyProgress || 0) * 2.51} 251`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#34d399" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-900">
                  {Math.round(stats.monthlyProgress || 0)}%
                </span>
              </div>
            </div>
            <div className="text-gray-600">Monthly Goal</div>
            <div className="text-sm text-gray-500">
              {stats.booksCompletedThisMonth || 0} of {Math.round((stats.yearlyGoal || 12) / 12)} books
            </div>
          </div>

          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">🏆</span>
            </div>
            <div className="text-gray-600">Achievement</div>
            <div className="text-sm text-gray-500">
              {stats.currentLevel || 'Beginner'} Reader
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Reading Activity</h3>
        <div className="space-y-4">
          {stats.recentActivity?.slice(0, 5).map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white">
                {activity.type === 'completed' ? '✅' : activity.type === 'started' ? '📖' : '📝'}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{activity.description}</p>
                <p className="text-sm text-gray-600">{activity.time}</p>
              </div>
            </div>
          )) || (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📊</div>
              <p>Start reading to see your activity here!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Analytics;