import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';

function ReadingSessions() {
  const [sessions, setSessions] = useState([]);
  const [books, setBooks] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSession, setNewSession] = useState({
    bookId: '',
    startPage: '',
    endPage: '',
    duration: '',
    notes: '',
    mood: '',
    location: ''
  });
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchSessions();
    fetchBooks();
    fetchStats();
  }, []);

  const fetchSessions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/reading-sessions`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/books?status=IN_PROGRESS&limit=100`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setBooks(data.books);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/reading-sessions/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const createSession = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/reading-sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newSession,
          startPage: parseInt(newSession.startPage),
          endPage: parseInt(newSession.endPage),
          duration: parseInt(newSession.duration)
        })
      });

      if (response.ok) {
        fetchSessions();
        fetchStats();
        setShowCreateModal(false);
        setNewSession({
          bookId: '',
          startPage: '',
          endPage: '',
          duration: '',
          notes: '',
          mood: '',
          location: ''
        });
      }
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  const deleteSession = async (id) => {
    if (!confirm('Are you sure you want to delete this reading session?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/reading-sessions/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        fetchSessions();
        fetchStats();
      }
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  const getMoodEmoji = (mood) => {
    const moods = {
      happy: '😊',
      focused: '🎯',
      relaxed: '😌',
      tired: '😴',
      excited: '🤩',
      calm: '😇'
    };
    return moods[mood] || '';
  };

  const getLocationIcon = (location) => {
    const locations = {
      home: '🏠',
      cafe: '☕',
      library: '',
      park: '🌳',
      commute: '🚊',
      bed: '🛏️'
    };
    return locations[location] || '📍';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl text-gray-600">Loading reading sessions...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Reading Sessions</h1>
          <p className="text-gray-600">Track your reading progress and habits</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition duration-200 shadow-lg hover:shadow-xl"
          style={{ backgroundColor: '#1a535c' }}
        >
          Log Session
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-900">{stats.totalSessions || 0}</div>
              <div className="text-gray-600">Total Sessions</div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-900">{stats.totalPages || 0}</div>
              <div className="text-gray-600">Pages Read</div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-900">{Math.round((stats.totalMinutes || 0) / 60)}</div>
              <div className="text-gray-600">Hours Read</div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-900">{stats.avgSessionTime || 0}</div>
              <div className="text-gray-600">Avg Session (min)</div>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
            </div>
          </div>
        </div>
      </div>

      {/* Sessions List */}
      {sessions.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4"></div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No reading sessions yet</h3>
          <p className="text-gray-600 mb-6">Start logging your reading sessions to track your progress</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition duration-200 shadow-lg hover:shadow-xl"
            style={{ backgroundColor: '#1a535c' }}
          >
            Log First Session
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Recent Sessions</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {sessions.map((session) => (
              <div key={session.id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {session.book?.title}
                      </h3>
                      <span className="text-gray-500">by {session.book?.author}</span>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-600 mb-3">
                      <span> Pages {session.startPage}-{session.endPage} ({session.endPage - session.startPage} pages)</span>
                      <span>⏰ {session.duration} minutes</span>
                      <span>📅 {new Date(session.date).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center space-x-4 mb-3">
                      {session.mood && (
                        <span className="flex items-center space-x-1">
                          <span>{getMoodEmoji(session.mood)}</span>
                          <span className="text-sm text-gray-600 capitalize">{session.mood}</span>
                        </span>
                      )}
                      {session.location && (
                        <span className="flex items-center space-x-1">
                          <span>{getLocationIcon(session.location)}</span>
                          <span className="text-sm text-gray-600 capitalize">{session.location}</span>
                        </span>
                      )}
                    </div>

                    {session.notes && (
                      <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">
                        {session.notes}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => deleteSession(session.id)}
                    className="text-gray-400 hover:text-red-500 transition ml-4"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Session Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Log Reading Session</h2>
            
            <form onSubmit={createSession} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Book *
                </label>
                <select
                  value={newSession.bookId}
                  onChange={(e) => setNewSession({ ...newSession, bookId: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select a book</option>
                  {books.map((book) => (
                    <option key={book.id} value={book.id}>
                      {book.title} by {book.author}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Page *
                  </label>
                  <input
                    type="number"
                    value={newSession.startPage}
                    onChange={(e) => setNewSession({ ...newSession, startPage: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Page *
                  </label>
                  <input
                    type="number"
                    value={newSession.endPage}
                    onChange={(e) => setNewSession({ ...newSession, endPage: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                    min={newSession.startPage || 1}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  value={newSession.duration}
                  onChange={(e) => setNewSession({ ...newSession, duration: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                  min="1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mood
                  </label>
                  <select
                    value={newSession.mood}
                    onChange={(e) => setNewSession({ ...newSession, mood: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select mood</option>
                    <option value="happy">😊 Happy</option>
                    <option value="focused">🎯 Focused</option>
                    <option value="relaxed">😌 Relaxed</option>
                    <option value="tired">😴 Tired</option>
                    <option value="excited">🤩 Excited</option>
                    <option value="calm">😇 Calm</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <select
                    value={newSession.location}
                    onChange={(e) => setNewSession({ ...newSession, location: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select location</option>
                    <option value="home">🏠 Home</option>
                    <option value="cafe">☕ Cafe</option>
                    <option value="library"> Library</option>
                    <option value="park">🌳 Park</option>
                    <option value="commute">🚊 Commute</option>
                    <option value="bed">🛏️ Bed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={newSession.notes}
                  onChange={(e) => setNewSession({ ...newSession, notes: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows="3"
                  placeholder="How was your reading session? Any thoughts or insights?"
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition duration-200"
                  style={{ backgroundColor: '#1a535c' }}
                >
                  Log Session
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-200 transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReadingSessions;