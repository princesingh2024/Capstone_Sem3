import { useState } from 'react';
import { API_URL } from '../config';

function Auth({ setToken }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const body = isLogin 
        ? { email, password }
        : { name, email, password };

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      
      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          setToken(data.token);
        }, 1000);
      } else {
        setError(data.error || `${isLogin ? 'Login' : 'Signup'} failed`);
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess(false);
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: '#1a535c' }}>
            <span className="text-white text-2xl font-bold">📚</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="text-gray-600">
            {isLogin 
              ? 'Sign in to access your reading library' 
              : 'Start your reading journey with us'
            }
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
            <span className="text-lg mr-2">✓</span>
            <p className="text-sm font-medium">
              {isLogin ? 'Login successful!' : 'Account created!'} Redirecting...
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name field (only for signup) */}
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 text-gray-900"
                style={{ '--tw-ring-color': '#1a535c' }}
                placeholder="Enter your full name"
                required={!isLogin}
              />
            </div>
          )}

          {/* Email field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 text-gray-900"
              style={{ '--tw-ring-color': '#1a535c' }}
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 text-gray-900"
              style={{ '--tw-ring-color': '#1a535c' }}
              placeholder={isLogin ? 'Enter your password' : 'Create a password'}
              required
            />
          </div>

          {/* Terms checkbox (only for signup) */}
          {!isLogin && (
            <div className="flex items-start">
              <input
                type="checkbox"
                className="mt-1 mr-3 rounded"
                required
              />
              <label className="text-sm text-gray-600">
                I agree to the Terms of Service and Privacy Policy
              </label>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full text-white font-semibold py-3 rounded-lg hover:opacity-90 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#1a535c' }}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isLogin ? 'Signing in...' : 'Creating account...'}
              </span>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        {/* Toggle between login/signup */}
        <div className="text-center">
          <p className="text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button
              onClick={toggleMode}
              className="font-semibold hover:opacity-80 transition"
              style={{ color: '#1a535c' }}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Auth;