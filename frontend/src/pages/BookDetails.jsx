import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setBook(data);
      } else {
        navigate('/library');
      }
    } catch (error) {
      console.error('Error fetching book:', error);
      navigate('/library');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/books/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        const updatedBook = await response.json();
        setBook(updatedBook);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'TO_READ': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'ON_HOLD': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'DNF': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getFormatIcon = (format) => {
    switch (format) {
      case 'EBOOK': return '📱';
      case 'AUDIOBOOK': return '🎧';
      case 'PDF': return '📄';
      default: return '📖';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl text-gray-600">Loading book details...</div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Book not found</h2>
          <Link to="/library" className="text-indigo-600 hover:text-indigo-700">
            Return to Library
          </Link>
        </div>
      </div>
    );
  }

  const progressPercentage = book.pages ? Math.round((book.currentPage / book.pages) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link to="/library" className="text-indigo-600 hover:text-indigo-700 mb-4 inline-block">
          ← Back to Library
        </Link>
      </div>

      {/* Book Info Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
        <div className="md:flex">
          {/* Book Cover */}
          <div className="md:w-1/3 p-8">
            <div className="w-full h-96 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
              {book.coverImage ? (
                <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <div className="text-center">
                  <div className="text-6xl mb-4">📚</div>
                  <div className="text-gray-600">No Cover</div>
                </div>
              )}
            </div>
          </div>

          {/* Book Details */}
          <div className="md:w-2/3 p-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(book.status)}`}>
                  {book.status.replace('_', ' ')}
                </span>
                <span className="text-2xl">{getFormatIcon(book.format)}</span>
              </div>
              <Link
                to={`/edit-book/${book.id}`}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Edit Book
              </Link>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-2">{book.title}</h1>
            <p className="text-xl text-gray-600 mb-4">by {book.author}</p>

            {/* Genres */}
            {book.genre && book.genre.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {book.genre.map((genre, index) => (
                  <span key={index} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm rounded-full">
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {/* Progress */}
            {book.pages && (
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Reading Progress</span>
                  <span>{book.currentPage}/{book.pages} pages ({progressPercentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex space-x-3">
              {book.status === 'TO_READ' && (
                <button
                  onClick={() => updateStatus('IN_PROGRESS')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Start Reading
                </button>
              )}
              {book.status === 'IN_PROGRESS' && (
                <button
                  onClick={() => updateStatus('COMPLETED')}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Mark Complete
                </button>
              )}
              <button
                onClick={() => updateStatus('ON_HOLD')}
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition"
              >
                Put on Hold
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-8">
            {['overview', 'notes', 'sessions'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-8">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {book.description && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700">{book.description}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Book Information</h3>
                  {book.isbn && <p><span className="font-medium">ISBN:</span> {book.isbn}</p>}
                  {book.publisher && <p><span className="font-medium">Publisher:</span> {book.publisher}</p>}
                  {book.publishedYear && <p><span className="font-medium">Published:</span> {book.publishedYear}</p>}
                  {book.language && <p><span className="font-medium">Language:</span> {book.language}</p>}
                  <p><span className="font-medium">Format:</span> {book.format}</p>
                  {book.pages && <p><span className="font-medium">Pages:</span> {book.pages}</p>}
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Reading Details</h3>
                  <p><span className="font-medium">Added:</span> {new Date(book.dateAdded).toLocaleDateString()}</p>
                  {book.dateStarted && <p><span className="font-medium">Started:</span> {new Date(book.dateStarted).toLocaleDateString()}</p>}
                  {book.dateFinished && <p><span className="font-medium">Finished:</span> {new Date(book.dateFinished).toLocaleDateString()}</p>}
                  {book.purchasePrice && <p><span className="font-medium">Purchase Price:</span> ${book.purchasePrice}</p>}
                  {book.location && <p><span className="font-medium">Location:</span> {book.location}</p>}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-6">
              {book.notes ? (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Personal Notes</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-wrap">{book.notes}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">📝</div>
                  <p className="text-gray-600">No notes yet</p>
                  <Link
                    to={`/edit-book/${book.id}`}
                    className="text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Add notes
                  </Link>
                </div>
              )}

              {book.review && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Review</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-wrap">{book.review}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'sessions' && (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">📖</div>
              <p className="text-gray-600 mb-4">Reading sessions will appear here</p>
              <Link
                to="/reading-sessions"
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Go to Reading Sessions
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookDetails;