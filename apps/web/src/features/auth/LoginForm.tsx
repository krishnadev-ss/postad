import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login } from '../../api/auth';
import { useAuth } from '../../hooks/useAuth';

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof schema>;

export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: authLogin } = useAuth();
  const [serverError, setServerError] = useState('');

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setServerError('');
    try {
      const response = await login(data);
      authLogin(response.user, response.access_token);
      navigate(from, { replace: true });
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Login failed. Please check your credentials.';
      setServerError(Array.isArray(message) ? message.join(', ') : message);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h2>
      <p className="text-gray-500 text-sm mb-6">Sign in to your POSTAD account</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {serverError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-700 text-sm">{serverError}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Email address
          </label>
          <input
            type="email"
            {...register('email')}
            placeholder="you@example.com"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Password
          </label>
          <input
            type="password"
            {...register('password')}
            placeholder="••••••••"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
        >
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Don't have an account?{' '}
        <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
          Create one
        </Link>
      </p>

      {/* Demo credentials */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg border border-gray-100">
        <p className="text-xs font-medium text-gray-600 mb-1.5">Demo Credentials</p>
        <div className="space-y-0.5 text-xs text-gray-500">
          <p>Admin: admin@postad.com / Admin@123</p>
          <p>Provider: provider@postad.com / Provider@123</p>
          <p>Advertiser: advertiser@postad.com / Advertiser@123</p>
        </div>
      </div>
    </div>
  );
}
