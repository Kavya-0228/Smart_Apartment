import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

interface EmptyStateProps {
  message: string;
  actionLabel?: string;
  actionTo?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message, actionLabel, actionTo, onAction }) => (
  <div className="text-center py-16">
    <div className="text-5xl mb-4">📭</div>
    <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">{message}</p>
    {actionLabel && actionTo && (
      <Link to={actionTo}>
        <Button>{actionLabel}</Button>
      </Link>
    )}
    {actionLabel && onAction && (
      <Button onClick={onAction}>{actionLabel}</Button>
    )}
  </div>
);

export default EmptyState;
