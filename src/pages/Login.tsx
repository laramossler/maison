import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setError('');
    setLoading(true);

    if (isSignUp) {
      const { error } = await signUp(email.trim(), password);
      if (error) {
        setError(error);
      } else {
        setSignUpSuccess(true);
      }
    } else {
      const { error } = await signIn(email.trim(), password);
      if (error) {
        setError(error);
      }
    }
    setLoading(false);
  };

  if (signUpSuccess) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-6">
        <div className="max-w-sm w-full text-center">
          <div className="w-14 h-14 mx-auto border border-gold/30 flex items-center justify-center mb-6">
            <div className="w-[50px] h-[50px] border border-gold/20 flex items-center justify-center">
              <span className="font-display text-gold text-xl tracking-display font-light">L</span>
            </div>
          </div>

          <h1 className="font-display text-2xl text-ink tracking-display font-light mb-4">
            Welcome
          </h1>

          <p className="font-body text-sm text-warm-gray leading-relaxed mb-6">
            Please check your email to confirm your account, then return here to sign in.
          </p>

          <button
            onClick={() => { setSignUpSuccess(false); setIsSignUp(false); }}
            className="font-sans text-[11px] uppercase tracking-label text-gold hover:text-gold-light transition-colors duration-300"
          >
            Return to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="max-w-sm w-full">
        <div className="text-center mb-10">
          <div className="w-14 h-14 mx-auto border border-gold/30 flex items-center justify-center mb-6">
            <div className="w-[50px] h-[50px] border border-gold/20 flex items-center justify-center">
              <span className="font-display text-gold text-xl tracking-display font-light">L</span>
            </div>
          </div>

          <h1 className="font-display text-3xl text-ink tracking-display font-light mb-2">
            The Ledger
          </h1>
          <p className="font-body text-xs text-warm-gray/50 italic">
            Your private ledger for the art of entertaining
          </p>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <div className="flex-1 border-t border-gold/20" />
          <span className="text-gold/40 text-[7px] leading-none" style={{ fontFamily: 'serif' }}>&#9830;</span>
          <div className="flex-1 border-t border-gold/20" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="font-sans text-[10px] uppercase tracking-label text-warm-gray block mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={isSignUp ? 'Choose a password' : 'Your password'}
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              minLength={6}
              required
            />
          </div>

          {error && (
            <p className="font-body text-sm text-red-700/70 italic">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !email.trim() || !password.trim()}
            className="w-full font-sans text-[11px] uppercase tracking-label text-gold border border-gold/40 px-8 py-3 hover:bg-gold/5 transition-all duration-400 disabled:opacity-30 disabled:cursor-default"
          >
            {loading ? 'One moment...' : isSignUp ? 'Create Account' : 'Open Your Ledger'}
          </button>
        </form>

        <div className="text-center mt-8">
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
            className="font-body text-xs text-warm-gray/50 hover:text-warm-gray transition-colors duration-300 italic"
          >
            {isSignUp ? 'Already have an account? Sign in' : 'New here? Create an account'}
          </button>
        </div>

        <div className="flex items-center gap-3 mt-10">
          <div className="flex-1 border-t border-gold/20" />
          <span className="text-gold/40 text-[7px] leading-none" style={{ fontFamily: 'serif' }}>&#9830;</span>
          <div className="flex-1 border-t border-gold/20" />
        </div>

        <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-warm-gray/40 mt-4 text-center">
          Effortless is a system
        </p>
      </div>
    </div>
  );
};

export default Login;
