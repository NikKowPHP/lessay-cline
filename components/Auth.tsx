// ROO-AUDIT-TAG :: audit_remediation_phase_1.md :: Replace alert with toast notifications
// ROO-AUDIT-TAG :: audit_remediation_phase_2.md :: Replace alert with toast notifications
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState } from 'react';
import toast from 'react-hot-toast';
import toast from 'react-hot-toast';
import logger from '@/lib/logger';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const supabase = createClientComponentClient();

  const handleSignUp = async () => {
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${location.origin}/auth/callback` },
      });
      if (error) throw error;
      toast.success('Check your email for the confirmation link!');
    } catch (error) {
      logger.error({ error }, 'Sign in error');
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error) {
      logger.error({ error }, 'Sign up error');
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
      </div>
      {error && <div className="error-message">{error}</div>}
      <div className="button-group">
        <button onClick={handleSignUp} disabled={loading}>
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
        <button onClick={handleSignIn} disabled={loading}>
          {loading ? 'Loading...' : 'Sign In'}
        </button>
      </div>
    </div>
  );
}
// ROO-AUDIT-TAG :: audit_remediation_phase_2.md :: END