'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        setError('Invalid password');
      }
    } catch (err) {
      setError('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 400, paddingTop: 'var(--space-10)' }}>
      <div className="card" style={{ padding: 'var(--space-6)' }}>
        <h1 style={{ marginBottom: 'var(--space-2)' }}>Admin Access</h1>
        <p className="text-muted" style={{ marginBottom: 'var(--space-5)' }}>
          Enter the admin password to continue.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label className="label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoFocus
            />
          </div>

          {error && (
            <div style={{ 
              padding: 'var(--space-3)', 
              background: 'var(--danger-subtle)', 
              color: 'var(--danger)',
              borderRadius: 'var(--radius)',
              fontSize: '0.875rem',
              marginBottom: 'var(--space-4)'
            }}>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%' }}
            disabled={isLoading || !password}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
