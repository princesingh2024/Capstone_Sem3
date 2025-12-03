import { useState } from 'react';
import { Link } from 'react-router-dom';

function Signup({ setToken }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          setToken(data.token);
        }, 1500);
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch (err) {
      setError('Connection error');
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Image/Illustration */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-12" style={{ backgroundColor: '#1a535c' }}>
        <div className="max-w-md text-white">
          <h2 className="text-4xl font-bold mb-6">Join our community</h2>
          <p className="text-red-100 text-lg mb-8">
            Create an account and unlock access to powerful tools that will help you achieve your goals.
          </p>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">✓</div>
              <span className="text-red-100">Free to get started</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">✓</div>
              <span className="text-red-100">No credit card required</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">✓</div>
              <span className="text-red-100">Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="w-12 h-12 rounded-xl mb-6" style={{ backgroundColor: '#1a535c' }}></div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Create account</h1>
            <p className="text-gray-600">Start your journey with us today</p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 text-red-700 px-4 py-3 rounded mb-6" style={{ borderColor: '#1a535c' }}>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded mb-6 flex items-center">
              <span className="text-2xl mr-3">✓</span>
              <p className="text-sm font-semibold">Account created successfully! Redirecting...</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition text-gray-900 placeholder-gray-400"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition text-gray-900 placeholder-gray-400"
                placeholder="name@company.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition text-gray-900 placeholder-gray-400"
                placeholder="Create a strong password"
                required
              />
            </div>

            <div className="flex items-start">
              <input type="checkbox" className="mt-1 mr-2 rounded" required />
              <label className="text-sm text-gray-600">
                I agree to the{' '}
                <a href="#" className="font-medium hover:opacity-80" style={{ color: '#1a535c' }}>
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="font-medium hover:opacity-80" style={{ color: '#1a535c' }}>
                  Privacy Policy
                </a>
              </label>
            </div>

            <button
              type="submit"
              className="w-full text-white font-semibold py-3 rounded-xl hover:opacity-90 transition duration-200 shadow-lg hover:shadow-xl"
              style={{ backgroundColor: '#1a535c' }}
            >
              Create account
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold hover:opacity-80" style={{ color: '#1a535c' }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
