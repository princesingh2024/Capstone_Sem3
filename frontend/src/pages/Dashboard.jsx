import { Link } from 'react-router-dom';

function Dashboard({ setToken }) {
  const handleLogout = () => {
    setToken(null);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-5xl font-bold mb-4" style={{ color: '#1a535c' }}>Welcome to ReadingHub</h1>
        <p className="text-gray-600 text-xl mb-8">Your personal digital library manager</p>
        
        <div className="flex space-x-4 mb-8">
          <Link
            to="/library"
            className="flex-1 text-white font-medium px-8 py-3 rounded-lg hover:opacity-90 transition duration-200"
            style={{ backgroundColor: '#1a535c' }}
          >
            Go to Library
          </Link>
          <Link
            to="/search-books"
            className="flex-1 bg-white font-medium px-8 py-3 rounded-lg border-2 hover:bg-gray-50 transition duration-200"
            style={{ color: '#1a535c', borderColor: '#1a535c' }}
          >
            Search Books
          </Link>
        </div>
        
        <button
          onClick={handleLogout}
          className="text-gray-500 hover:text-gray-700 font-medium"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
