import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useComplaints } from '../context/ComplaintContext';
import { useAuth } from '../context/AuthContext';
import { PRIORITY_COLORS, STATUS_BADGE_VARIANT, STATUS_LABELS } from '../types';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import StatsCard from '../components/StatsCard';
import EmptyState from '../components/EmptyState';

const Dashboard: React.FC = () => {
  const { complaints } = useComplaints();
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const myComplaints = useMemo(() =>
    user?.role === 'resident' ? complaints.filter(c => c.userId === user.id) : complaints,
    [complaints, user]
  );

  const stats = useMemo(() => ({
    total: myComplaints.length,
    open: myComplaints.filter(c => c.status === 'open').length,
    inProgress: myComplaints.filter(c => c.status === 'in-progress').length,
    resolved: myComplaints.filter(c => c.status === 'resolved').length,
  }), [myComplaints]);

  const filtered = useMemo(() => {
    return myComplaints
      .filter(c => statusFilter === 'all' || c.status === statusFilter)
      .filter(c => !searchTerm || [c.title, c.description, c.category]
        .some(f => f.toLowerCase().includes(searchTerm.toLowerCase())))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [myComplaints, statusFilter, searchTerm]);

  if (!user) {
    return (
      <EmptyState
        message="Please log in to view your dashboard"
        actionLabel="Login"
        actionTo="/login"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Welcome back, {user.name}
          </p>
        </div>
        <Link to="/raise-complaint">
          <Button>+ New Complaint</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Total" value={stats.total} icon="📋" color="text-blue-600" />
        <StatsCard label="Open" value={stats.open} icon="🔴" color="text-red-600" />
        <StatsCard label="In Progress" value={stats.inProgress} icon="🟡" color="text-yellow-600" />
        <StatsCard label="Resolved" value={stats.resolved} icon="🟢" color="text-green-600" />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by title, description or category..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md
            bg-white dark:bg-gray-800 text-gray-900 dark:text-white
            focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md
            bg-white dark:bg-gray-800 text-gray-900 dark:text-white
            focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* Complaint Cards */}
      {filtered.length === 0 ? (
        <EmptyState
          message="No complaints found."
          actionLabel="Raise a Complaint"
          actionTo="/raise-complaint"
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(complaint => (
            <Link key={complaint.id} to={`/complaint/${complaint.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <div className="flex justify-between items-start mb-3 gap-2">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-2 flex-1">
                    {complaint.title}
                  </h3>
                  <Badge variant={STATUS_BADGE_VARIANT[complaint.status]}>
                    {STATUS_LABELS[complaint.status]}
                  </Badge>
                </div>

                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {complaint.description}
                </p>

                <div className="flex justify-between items-center text-sm border-t border-gray-100 dark:border-gray-700 pt-3">
                  <span className="text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-xs">
                    {complaint.category}
                  </span>
                  <span className={`font-semibold capitalize text-xs ${PRIORITY_COLORS[complaint.priority]}`}>
                    ▲ {complaint.priority}
                  </span>
                </div>

                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                  {new Date(complaint.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
