import { Link } from 'react-router-dom';
import { useState } from 'react';

function BookCard({ book, onDelete, onStatusChange }) {
  const [showMenu, setShowMenu] = useState(false);

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

  const getStatusText = (status) => {
    switch (status) {
      case 'COMPLETED': return 'Completed';
      case 'IN_PROGRESS': return 'Reading';
      case 'TO_READ': return 'To Read';
      case 'ON_HOLD': return 'On Hold';
      case 'DNF': return 'DNF';
      default: return status;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'URGENT': return 'text-red-600';
      case 'HIGH': return 'text-orange-600';
      case 'MEDIUM': return 'text-yellow-600';
      case 'LOW': return 'text-green-600';
      default: return 'text-gray-600';
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

  const progressPercentage = book.pages ? Math.round((book.currentPage / book.pages) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(book.status)}`}>
            {getStatusText(book.status)}
          </span>
          <span className="text-lg">{getFormatIcon(book.format)}</span>
          {book.priority !== 'MEDIUM' && (
            <span className={`text-sm font-medium ${getPriorityColor(book.priority)}`}>
              {book.priority}
            </span>
          )}
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-100 rounded-lg"
          >
            ⋮
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
              <Link
                to={`/edit-book/${book.id}`}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
                onClick={() => setShowMenu(false)}
              >
                Edit Details
              </Link>
              <Link
                to={`/book/${book.id}/session`}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
                onClick={() => setShowMenu(false)}
              >
                Start Reading
              </Link>
              <Link
                to={`/book/${book.id}/quotes`}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
                onClick={() => setShowMenu(false)}
              >
                View Quotes
              </Link>
              <hr className="my-2" />
              <button
                onClick={() => {
                  onDelete(book.id);
                  setShowMenu(false);
                }}
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition"
              >
                Delete Book
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Book Cover Placeholder */}
      <div className="w-full h-48 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl mb-4 flex items-center justify-center">
        {book.coverImage ? (
          <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover rounded-xl" />
        ) : (
          <div className="text-center">
            <div className="text-4xl mb-2">📚</div>
            <div className="text-sm text-gray-600">No Cover</div>
          </div>
        )}
      </div>

      {/* Book Info */}
      <div className="space-y-3">
        <div>
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2 mb-1">{book.title}</h3>
          <p className="text-gray-600 font-medium">by {book.author}</p>
        </div>

        {/* Genres */}
        {book.genre && book.genre.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {book.genre.slice(0, 3).map((genre, index) => (
              <span key={index} className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-md">
                {genre}
              </span>
            ))}
            {book.genre.length > 3 && (
              <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-md">
                +{book.genre.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Progress Bar */}
        {book.pages && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress</span>
              <span>{book.currentPage}/{book.pages} pages ({progressPercentage}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Rating */}
        {book.reviews && book.reviews.length > 0 && (
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`text-lg ${i < book.reviews[0].rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                ⭐
              </span>
            ))}
            <span className="text-sm text-gray-600 ml-2">({book.reviews[0].rating}/5)</span>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex space-x-2 pt-2">
          {book.status === 'TO_READ' && (
            <button
              onClick={() => onStatusChange(book.id, 'IN_PROGRESS')}
              className="flex-1 bg-blue-50 text-blue-700 font-medium py-2 px-3 rounded-lg hover:bg-blue-100 transition text-sm"
            >
              Start Reading
            </button>
          )}
          {book.status === 'IN_PROGRESS' && (
            <button
              onClick={() => onStatusChange(book.id, 'COMPLETED')}
              className="flex-1 bg-green-50 text-green-700 font-medium py-2 px-3 rounded-lg hover:bg-green-100 transition text-sm"
            >
              Mark Complete
            </button>
          )}
          <Link
            to={`/edit-book/${book.id}`}
            className="flex-1 bg-gray-50 text-gray-700 font-medium py-2 px-3 rounded-lg hover:bg-gray-100 transition text-sm text-center"
          >
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BookCard;