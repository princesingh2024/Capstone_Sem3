import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Library from './pages/Library';
import AddBook from './pages/AddBook';
import EditBook from './pages/EditBook';
import Collections from './pages/Collections';
import ReadingSessions from './pages/ReadingSessions';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import BookDetails from './pages/BookDetails';
import Navbar from './components/Navbar';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const ProtectedRoute = ({ children }) => {
    return token ? (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <Navbar />
        {children}
      </div>
    ) : (
      <Navigate to="/login" />
    );
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!token ? <Login setToken={setToken} /> : <Navigate to="/library" />} />
        <Route path="/signup" element={!token ? <Signup setToken={setToken} /> : <Navigate to="/library" />} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard setToken={setToken} />
          </ProtectedRoute>
        } />
        
        <Route path="/library" element={
          <ProtectedRoute>
            <Library />
          </ProtectedRoute>
        } />
        
        <Route path="/add-book" element={
          <ProtectedRoute>
            <AddBook />
          </ProtectedRoute>
        } />
        
        <Route path="/edit-book/:id" element={
          <ProtectedRoute>
            <EditBook />
          </ProtectedRoute>
        } />
        
        <Route path="/book/:id" element={
          <ProtectedRoute>
            <BookDetails />
          </ProtectedRoute>
        } />
        
        <Route path="/collections" element={
          <ProtectedRoute>
            <Collections />
          </ProtectedRoute>
        } />
        
        <Route path="/reading-sessions" element={
          <ProtectedRoute>
            <ReadingSessions />
          </ProtectedRoute>
        } />
        
        <Route path="/analytics" element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        
        <Route path="/" element={<Navigate to={token ? "/library" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
