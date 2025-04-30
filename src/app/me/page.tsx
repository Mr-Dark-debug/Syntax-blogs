"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import '@/styles/neo-brutalism.css';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Call the authentication API
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Authentication failed');
      }

      const data = await response.json();

      // Set the token in localStorage
      localStorage.setItem('adminToken', data.token);

      // Redirect to admin dashboard
      router.push('/admin');
    } catch (err) {
      console.error('Login error:', err);

      // Fallback for demo purposes
      if (username === 'psadmin' && password === 'ps123') {
        localStorage.setItem('adminToken', 'demo-token-12345');
        router.push('/admin');
      } else {
        setError(err instanceof Error ? err.message : 'Invalid username or password');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="neo-brutalism min-h-screen flex items-center justify-center bg-white p-4">
      <div className="neo-container w-full max-w-md p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Admin Login</h1>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="w-full px-3 py-2 border border-black focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-3 py-2 border border-black focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="neo-button w-full py-2 px-4 text-center font-bold"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Default credentials for demo:</p>
          <p>Username: psadmin | Password: ps123</p>
        </div>
      </div>
    </div>
  );
}
