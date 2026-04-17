import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useComplaints } from '../context/ComplaintContext';
import { useAuth } from '../context/AuthContext';
import { ComplaintStatus, STATUS_BADGE_VARIANT, STATUS_LABELS, PRIORITY_COLORS } from '../types';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import StatsCard from '../components/StatsCard';
import EmptyState from '../components/EmptyState';

const AdminPanel: React.FC = () => {
  const { complaints, updateComplaint } = useComplaints();
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const stats = useMemo(() => ({
    total: complaints.length,
    open: complaints.filter(c => c.status === 'open').length,
    inProgress: complaints.filter(c => c.status === 'in-progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
  }), [complaints]);

  const filtered = useMemo(() =>
    complaints
      .filter(c => statusFilter === 'all' || c.status === statusFilter)
      .filter(c => priorityFilter === 'all' || c.priority === priorityFilter)
      .filter(c => !searchTerm || [c.title, c.description, c.userName]
        .some(f => f.toLowerCase().includes(searchTerm.toLowerCase())))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [complaints, statusFilter, priorityFilter, searchTerm]
  );

  if (!user || user.role !== 'admin') {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">🔒</div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-4">Admin privileges required.</p>
        <Link to="/"><Button variant="secondary">Back to Dashboard</Button></Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage all complaints</p>
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
          type="text" placeholder="Search by title, description or resident..."
          value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md
            bg-white dark:bg-gray-800 text-gray-900 dark:text-white
            focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md
            bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
        <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md
            bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="all">All Priority</option>
          <option value="high">🔴 High</option>
          <option value="medium">🟡 Medium</option>
          <option value="low">🟢 Low</option>
        </select>
      </div>

      {/* Complaints List */}
      {filtered.length === 0 ? (
        <EmptyState message="No complaints match your filters." />
      ) : (
        <div className="space-y-3">
          {filtered.map(complaint => (
            <Card key={complaint.id} className="hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3 mb-2">
                    <Link
                      to={`/complaint/${complaint.id}`}
                      className="text-base font-semibold text-blue-600 dark:text-blue-400 hover:underline line-clamp-1"
                    >
                      {complaint.title}
                    </Link>
                    <Badge variant={STATUS_BADGE_VARIANT[complaint.status]}>
                      {STATUS_LABELS[complaint.status]}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
                    {complaint.description}
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span>👤 {complaint.userName}</span>
                    <span>📁 {complaint.category}</span>
                    <span className={`font-semibold capitalize ${PRIORITY_COLORS[complaint.priority]}`}>
                      ▲ {complaint.priority}
                    </span>
                    <span>🕐 {new Date(complaint.createdAt).toLocaleDateString()}</span>
                    {complaint.assignedTo && <span>🔧 {complaint.assignedTo}</span>}
                  </div>
                </div>

                {/* Admin Controls */}
                <div className="flex flex-col gap-2 shrink-0 sm:w-48">
                  <select
                    value={complaint.status}
                    onChange={e => updateComplaint(complaint.id, { status: e.target.value as ComplaintStatus })}
                    className="px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-md
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                      focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Assign to staff..."
                    value={complaint.assignedTo || ''}
                    onChange={e => updateComplaint(complaint.id, { assignedTo: e.target.value })}
                    className="px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-md
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                      focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
