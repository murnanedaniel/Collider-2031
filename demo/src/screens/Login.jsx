import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/utils/constants';
import Button from '@/components/ui/Button';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [showYear, setShowYear] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    if (isLoggedIn) {
      // Get current date/time
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
      const monthDay = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
      setCurrentDateTime(`It's ${timeStr}, ${dayName} ${monthDay}`);

      // Sequence: Welcome -> Date -> Year -> Button
      const timer1 = setTimeout(() => setShowWelcome(true), 300);
      const timer2 = setTimeout(() => setShowDate(true), 1300); // 1 second after welcome
      const timer3 = setTimeout(() => setShowYear(true), 3300); // 2 seconds after date

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isLoggedIn]);

  const handleLogin = (e) => {
    e.preventDefault();
    // Accept any email/password
    if (email && password) {
      setIsLoggedIn(true);
    }
  };

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-3xl w-full text-center space-y-6">
          <div
            className={`transition-all duration-1000 ${
              showWelcome ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            <h1 className="text-5xl md:text-6xl font-light tracking-tight text-gray-900">
              Welcome to ColliderLab, Maja
            </h1>
          </div>

          <div
            className={`transition-all duration-1000 ${
              showDate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            <p className="text-2xl md:text-3xl text-gray-500 font-light">
              {currentDateTime}
            </p>
          </div>

          <div
            className={`transition-all duration-1000 ${
              showYear ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            <p className="text-3xl md:text-4xl text-gray-900 font-light">
              2031
            </p>
          </div>

          {showYear && (
            <div
              className="pt-8 transition-all duration-1000 opacity-0 animate-fade-in-up"
              style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}
            >
              <Button onClick={() => navigate(ROUTES.DASHBOARD)}>
                Dashboard
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light tracking-tight text-gray-900 mb-2">
            ColliderLab
          </h1>
          <p className="text-gray-500">Sign in to continue</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow"
              placeholder="maja.andersen@ethz.ch"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow"
              placeholder="••••••••"
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Demo mode: Any credentials will work
        </p>
      </div>
    </div>
  );
}

