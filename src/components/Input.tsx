import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const baseClass = `w-full px-3 py-2 border rounded-md text-sm
  bg-white dark:bg-gray-800 text-gray-900 dark:text-white
  placeholder-gray-400 dark:placeholder-gray-500
  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
  transition-colors`;

const Input: React.FC<InputProps> = ({ label, error, id, className = '', ...props }) => (
  <div className="w-full">
    {label && (
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
    )}
    <input
      id={id}
      className={`${baseClass} ${error
        ? 'border-red-400 dark:border-red-500'
        : 'border-gray-300 dark:border-gray-600'
      } ${className}`}
      {...props}
    />
    {error && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{error}</p>}
  </div>
);

export default Input;
