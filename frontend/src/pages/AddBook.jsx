import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL } from '../config';

function AddBook() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: [],
    pages: '',
    status: 'TO_READ',
    format: 'PHYSICAL',
    priority: 'MEDIUM',
    isbn: '',
    publisher: '',
    publishedYear: '',
    language: 'English',
    description: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      // Process the form data
      const processedData = {
        ...formData,
        pages: formData.pages ? parseInt(formData.pages) : null,
        publishedYear: formData.publishedYear ? parseInt(formData.publishedYear) : null
      };

      const response = await fetch(`${API_URL}/api/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(processedData)
      });

      if (response.ok) {
        navigate('/library');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to add book');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <Link to="/library" className="hover:opacity-80" style={{ color: '#1a535c' }}>
              ← Back to Library
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Add New Book</h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          {error && (
            <div className="bg-red-50 border-l-4 text-red-700 px-4 py-3 rounded mb-6" style={{ borderColor: '#1a535c' }}>
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900"
                placeholder="Enter book title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author *
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900"
                placeholder="Enter author name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Genres (comma-separated)
              </label>
              <input
                type="text"
                name="genre"
                value={Array.isArray(formData.genre) ? formData.genre.join(', ') : formData.genre}
                onChange={(e) => setFormData({
                  ...formData,
                  genre: e.target.value.split(',').map(g => g.trim()).filter(g => g)
                })}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900"
                placeholder="e.g., Fiction, Mystery, Science Fiction"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Format
                </label>
                <select
                  name="format"
                  value={formData.format}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900"
                >
                  <option value="PHYSICAL"> Physical Book</option>
                  <option value="EBOOK"> E-book</option>
                  <option value="AUDIOBOOK"> Audiobook</option>
                  <option value="PDF"> PDF</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ISBN
                </label>
                <input
                  type="text"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900"
                  placeholder="978-0-123456-78-9"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <input
                  type="text"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900"
                  placeholder="English"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Publisher
                </label>
                <input
                  type="text"
                  name="publisher"
                  value={formData.publisher}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900"
                  placeholder="Publisher name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Published Year
                </label>
                <input
                  type="number"
                  name="publishedYear"
                  value={formData.publishedYear}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900"
                  placeholder="2023"
                  min="1000"
                  max={new Date().getFullYear()}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900"
                placeholder="Brief description of the book..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Pages
              </label>
              <input
                type="number"
                name="pages"
                value={formData.pages}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900"
                placeholder="Enter total number of pages"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reading Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900"
              >
                <option value="TO_READ">Want to Read</option>
                <option value="IN_PROGRESS">Currently Reading</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                style={{ backgroundColor: '#1a535c' }}
              >
                {loading ? 'Adding Book...' : 'Add Book'}
              </button>
              <Link
                to="/library"
                className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-200 transition duration-200 text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddBook;