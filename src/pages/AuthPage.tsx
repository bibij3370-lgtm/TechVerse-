import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';
import { SITE_CONFIG } from '../config/site';
import { usePageMeta } from '../hooks/usePageMeta';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

interface AuthPageProps {
  initialMode?: 'login' | 'register';
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>(initialMode);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resetMsg, setResetMsg] = useState<string | null>(null);
  const [resetEmail, setResetEmail] = useState('');

  const navigate = useNavigate();
  const loginDemo = useAuthStore((s) => s.loginDemo);
  const registerDemo = useAuthStore((s) => s.registerDemo);
  const requestPasswordReset = useAuthStore((s) => s.requestPasswordReset);
  const pushToast = useUIStore((s) => s.pushToast);

  usePageMeta(
    mode === 'register' ? 'Create Account | TechVerse' : 'Sign In | TechVerse',
    'Sign in or create a TechVerse account to manage orders, addresses, and synced wishlists.'
  );

  const loginForm = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });
  const registerForm = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });

  const handleLogin = (values: LoginValues) => {
    setErrorMsg(null);
    const res = loginDemo(values.email, values.password);
    if (!res.ok) {
      setErrorMsg(res.error || 'Unable to sign in.');
      return;
    }
    pushToast({ title: 'Welcome back to TechVerse', tone: 'success' });
    navigate('/account');
  };

  const handleRegister = (values: RegisterValues) => {
    setErrorMsg(null);
    const res = registerDemo(values.name, values.email, values.password);
    if (!res.ok) {
      setErrorMsg(res.error || 'Unable to create account.');
      return;
    }
    pushToast({ title: 'Account created', description: values.email, tone: 'success' });
    navigate('/account');
  };

  const handleDemoFill = () => {
    loginForm.setValue('email', 'demo@techverse.example');
    loginForm.setValue('password', 'TechVerse2026!');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10 sm:py-14">
      <div className="rounded-2xl border border-[#EAEAEA] dark:border-zinc-800 bg-white dark:bg-[#141418] p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#F5F5F5] dark:bg-zinc-900 mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              mode === 'login'
                ? 'bg-white dark:bg-zinc-800 text-[#151515] dark:text-white shadow-xs'
                : 'text-[#666666] dark:text-zinc-400'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              mode === 'register'
                ? 'bg-white dark:bg-zinc-800 text-[#151515] dark:text-white shadow-xs'
                : 'text-[#666666] dark:text-zinc-400'
            }`}
          >
            Register
          </button>
        </div>

        {!SITE_CONFIG.supabaseConfigured && (
          <div className="mb-5 rounded-xl bg-[#F9F9FA] dark:bg-zinc-900 border border-[#EAEAEA] dark:border-zinc-800 p-3 text-xs text-[#555555] dark:text-zinc-400">
            <p>
              <strong>Local Demo Auth Mode:</strong> Supabase credentials are not set. Test instantly with{' '}
              <span className="font-mono-tabular">demo@techverse.example</span> /{' '}
              <span className="font-mono-tabular">TechVerse2026!</span>
            </p>
            {mode === 'login' && (
              <button
                type="button"
                onClick={handleDemoFill}
                className="mt-1.5 font-semibold text-[#C8101E] hover:underline cursor-pointer"
              >
                Fill demo credentials
              </button>
            )}
          </div>
        )}

        {errorMsg && (
          <div
            role="alert"
            className="mb-4 rounded-xl bg-[#DC3545]/10 border border-[#DC3545]/30 px-3.5 py-2.5 text-xs font-medium text-[#DC3545]"
          >
            {errorMsg}
          </div>
        )}

        {mode === 'login' && (
          <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
            <h1 className="font-display text-2xl font-extrabold text-[#151515] dark:text-white">
              Sign in to TechVerse
            </h1>
            <div>
              <label htmlFor="login-email" className="block text-xs font-semibold mb-1.5">
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                {...loginForm.register('email')}
                className="w-full h-11 rounded-xl border border-[#EAEAEA] dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 text-sm"
              />
              {loginForm.formState.errors.email && (
                <p className="text-xs text-[#DC3545] mt-1">
                  {loginForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="login-password" className="block text-xs font-semibold mb-1.5">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                {...loginForm.register('password')}
                className="w-full h-11 rounded-xl border border-[#EAEAEA] dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 text-sm"
              />
              {loginForm.formState.errors.password && (
                <p className="text-xs text-[#DC3545] mt-1">
                  {loginForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setMode('reset')}
                className="text-xs font-semibold text-[#C8101E] hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full min-h-[44px] rounded-full bg-[#C8101E] text-white text-sm font-semibold hover:bg-[#A80D18] transition-colors cursor-pointer"
            >
              Sign In
            </button>
          </form>
        )}

        {mode === 'register' && (
          <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
            <h1 className="font-display text-2xl font-extrabold text-[#151515] dark:text-white">
              Create your account
            </h1>
            <div>
              <label htmlFor="reg-name" className="block text-xs font-semibold mb-1.5">
                Full Name
              </label>
              <input
                id="reg-name"
                {...registerForm.register('name')}
                className="w-full h-11 rounded-xl border border-[#EAEAEA] dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 text-sm"
              />
              {registerForm.formState.errors.name && (
                <p className="text-xs text-[#DC3545] mt-1">
                  {registerForm.formState.errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="reg-email" className="block text-xs font-semibold mb-1.5">
                Email Address
              </label>
              <input
                id="reg-email"
                type="email"
                {...registerForm.register('email')}
                className="w-full h-11 rounded-xl border border-[#EAEAEA] dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 text-sm"
              />
              {registerForm.formState.errors.email && (
                <p className="text-xs text-[#DC3545] mt-1">
                  {registerForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="reg-password" className="block text-xs font-semibold mb-1.5">
                Password
              </label>
              <input
                id="reg-password"
                type="password"
                {...registerForm.register('password')}
                className="w-full h-11 rounded-xl border border-[#EAEAEA] dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 text-sm"
              />
              {registerForm.formState.errors.password && (
                <p className="text-xs text-[#DC3545] mt-1">
                  {registerForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full min-h-[44px] rounded-full bg-[#C8101E] text-white text-sm font-semibold hover:bg-[#A80D18] transition-colors cursor-pointer"
            >
              Create Account
            </button>
          </form>
        )}

        {mode === 'reset' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const res = requestPasswordReset(resetEmail);
              setResetMsg(res.message);
            }}
            className="space-y-4"
          >
            <h1 className="font-display text-2xl font-extrabold text-[#151515] dark:text-white">
              Reset Password
            </h1>
            <p className="text-xs text-[#666666] dark:text-zinc-400">
              Enter your email address to receive a password reset link.
            </p>
            <input
              type="email"
              required
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              placeholder="you@example.com"
              aria-label="Reset email address"
              className="w-full h-11 rounded-xl border border-[#EAEAEA] dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 text-sm"
            />
            {resetMsg && <p className="text-xs text-[#218838] font-medium">{resetMsg}</p>}
            <button
              type="submit"
              className="w-full min-h-[44px] rounded-full bg-[#C8101E] text-white text-sm font-semibold hover:bg-[#A80D18] cursor-pointer"
            >
              Send Reset Link
            </button>
            <button
              type="button"
              onClick={() => setMode('login')}
              className="w-full text-xs font-semibold text-[#555555] hover:underline cursor-pointer"
            >
              Back to Sign In
            </button>
          </form>
        )}

        <p className="text-center text-xs text-[#666666] dark:text-zinc-400 mt-6 pt-4 border-t border-[#EAEAEA] dark:border-zinc-800">
          Prefer guest shopping?{' '}
          <Link to="/shop" className="font-semibold text-[#C8101E] hover:underline">
            Continue without signing in
          </Link>
        </p>
      </div>
    </div>
  );
};
