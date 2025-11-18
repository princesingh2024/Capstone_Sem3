function Dashboard({ setToken }) {
  const handleLogout = () => {
    setToken(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-3xl p-12 shadow-2xl border border-gray-100 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-5xl mx-auto mb-6 shadow-lg">
            ✓
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Login Successful!</h1>
          <p className="text-gray-600 text-xl mb-8">Welcome back! You have successfully logged into your account.</p>
          
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-8 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition duration-200 shadow-lg hover:shadow-xl"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
