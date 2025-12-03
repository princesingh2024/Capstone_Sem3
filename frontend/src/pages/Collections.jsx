import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';

function Collections() {
  const [collections, setCollections] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCollection, setNewCollection] = useState({
    name: '',
    description: '',
    color: '#6366f1',
    isPublic: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/collections`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setCollections(data);
      }
    } catch (error) {
      console.error('Error fetching collections:', error);
    } finally {
      setLoading(false);
    }
  };

  const createCollection = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/collections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newCollection)
      });

      if (response.ok) {
        fetchCollections();
        setShowCreateModal(false);
        setNewCollection({ name: '', description: '', color: '#6366f1', isPublic: false });
      }
    } catch (error) {
      console.error('Error creating collection:', error);
    }
  };

  const deleteCollection = async (id) => {
    if (!confirm('Are you sure you want to delete this collection?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/collections/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        fetchCollections();
      }
    } catch (error) {
      console.error('Error deleting collection:', error);
    }
  };

  const colors = [
    '#6366f1', '#8b5cf6', '#ec4899', '#ef4444', '#f97316',
    '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#6366f1'
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl text-gray-600">Loading collections...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Collections</h1>
          <p className="text-gray-600">Organize your books into custom collections</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition duration-200 shadow-lg hover:shadow-xl"
          style={{ backgroundColor: '#1a535c' }}
        >
          Create Collection
        </button>
      </div>

      {/* Collections Grid */}
      {collections.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4"></div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No collections yet</h3>
          <p className="text-gray-600 mb-6">Create your first collection to organize your books</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition duration-200 shadow-lg hover:shadow-xl"
            style={{ backgroundColor: '#1a535c' }}
          >
            Create Collection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-2xl"
                  style={{ backgroundColor: collection.color }}
                >
                </div>
                <div className="flex items-center space-x-2">
                  {collection.isPublic && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Public
                    </span>
                  )}
                  <button
                    onClick={() => deleteCollection(collection.id)}
                    className="text-gray-400 hover:text-red-500 transition"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">{collection.name}</h3>
              {collection.description && (
                <p className="text-gray-600 mb-4 line-clamp-2">{collection.description}</p>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>{collection._count?.books || 0} books</span>
                <span>Created {new Date(collection.createdAt).toLocaleDateString()}</span>
              </div>

              <Link
                to={`/collections/${collection.id}`}
                className="block w-full text-center bg-gray-50 text-gray-700 font-medium py-2 rounded-lg hover:bg-gray-100 transition"
              >
                View Collection
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Create Collection Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Collection</h2>
            
            <form onSubmit={createCollection} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Collection Name *
                </label>
                <input
                  type="text"
                  value={newCollection.name}
                  onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Sci-Fi Favorites"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newCollection.description}
                  onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows="3"
                  placeholder="Describe your collection..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color Theme
                </label>
                <div className="flex space-x-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewCollection({ ...newCollection, color })}
                      className={`w-8 h-8 rounded-full border-2 ${
                        newCollection.color === color ? 'border-gray-400' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={newCollection.isPublic}
                  onChange={(e) => setNewCollection({ ...newCollection, isPublic: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="isPublic" className="text-sm text-gray-700">
                  Make this collection public
                </label>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition duration-200"
                  style={{ backgroundColor: '#1a535c' }}
                >
                  Create Collection
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

export default Collections;