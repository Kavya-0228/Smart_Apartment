import React from 'react';
import Card from './Card';

interface StatsCardProps {
  label: string;
  value: number;
  icon: string;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon, color }) => (
  <Card className="flex items-center gap-4">
    <div className={`text-3xl p-3 rounded-full ${color} bg-opacity-10`}>{icon}</div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  </Card>
);

export default StatsCard;
