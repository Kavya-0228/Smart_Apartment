import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import { Role } from '../types';
import Input from '../components/Input';
import Select from '../components/Select';
import Button from '../components/Button';

const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = React.useState('');

  const { values, errors, set, blur, validate } = useForm(
    { name: '', email: '', password: '', confirmPassword: '', role: 'resident' },
    {
      name: v => !v.trim() ? 'Name is required' : v.trim().length < 2 ? 'Min 2 characters' : undefined,
      email: v => !v ? 'Email is required' : !/\S+@\S+\.\S+/.test(v) ? 'Invalid email' : undefined,
      password: v => !v ? 'Password is required' : v.length < 6 ? 'Min 6 characters' : undefined,
      confirmPassword: v => !v ? 'Please confirm password' : undefined,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    if (values.password !== values.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!register(values.name, values.email, values.password, values.role as Role)) {
      setError('Registration failed. Please try again.');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🏢</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Account</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Join Smart Complaint Tracker</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-8">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <Input
              id="name" label="Full Name" type="text"
              placeholder="John Doe" value={values.name}
              onChange={set('name')} onBlur={blur('name')} error={errors.name}
            />
            <Input
              id="email" label="Email Address" type="email"
              placeholder="you@example.com" value={values.email}
              onChange={set('email')} onBlur={blur('email')} error={errors.email}
            />
            <Input
              id="password" label="Password" type="password"
              placeholder="Min 6 characters" value={values.password}
              onChange={set('password')} onBlur={blur('password')} error={errors.password}
            />
            <Input
              id="confirmPassword" label="Confirm Password" type="password"
              placeholder="Re-enter password" value={values.confirmPassword}
              onChange={set('confirmPassword')} onBlur={blur('confirmPassword')} error={errors.confirmPassword}
            />
            <Select
              id="role" label="Register as"
              value={values.role} onChange={set('role')}
              options={[{ value: 'resident', label: 'Resident' }, { value: 'admin', label: 'Admin' }]}
            />

            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <Button type="submit" fullWidth size="lg">Create Account</Button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
