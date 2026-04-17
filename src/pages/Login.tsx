import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import { Role } from '../types';
import Input from '../components/Input';
import Select from '../components/Select';
import Button from '../components/Button';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = React.useState('');

  const { values, errors, set, blur, validate } = useForm(
    { email: '', password: '', role: 'resident' },
    {
      email: v => !v ? 'Email is required' : !/\S+@\S+\.\S+/.test(v) ? 'Invalid email' : undefined,
      password: v => !v ? 'Password is required' : v.length < 6 ? 'Min 6 characters' : undefined,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    if (!login(values.email, values.password, values.role as Role)) {
      setError('Invalid credentials. Please try again.');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🏢</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Smart Complaint Tracker</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Sign in to your account</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-8">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <Input
              id="email" label="Email Address" type="email"
              placeholder="you@example.com" value={values.email}
              onChange={set('email')} onBlur={blur('email')} error={errors.email}
            />
            <Input
              id="password" label="Password" type="password"
              placeholder="••••••••" value={values.password}
              onChange={set('password')} onBlur={blur('password')} error={errors.password}
            />
            <Select
              id="role" label="Login as"
              value={values.role} onChange={set('role')}
              options={[{ value: 'resident', label: 'Resident' }, { value: 'admin', label: 'Admin' }]}
            />

            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <Button type="submit" fullWidth size="lg">Sign In</Button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
              Register here
            </Link>
          </p>

          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md text-xs text-blue-700 dark:text-blue-300">
            <strong>Demo Admin:</strong> admin@apartment.com / password
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
