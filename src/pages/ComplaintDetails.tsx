import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useComplaints } from '../context/ComplaintContext';
import { useAuth } from '../context/AuthContext';
import { ComplaintStatus, PRIORITY_COLORS, STATUS_BADGE_VARIANT, STATUS_LABELS } from '../types';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';

const STATUS_STEPS: ComplaintStatus[] = ['open', 'in-progress', 'resolved'];

const ComplaintDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getComplaintById, addComment, updateComplaint } = useComplaints();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [commentText, setCommentText] = useState('');
  const [commentError, setCommentError] = useState('');

  const complaint = id ? getComplaintById(id) : undefined;

  if (!complaint) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Complaint not found</h2>
        <Button onClick={() => navigate('/')}>Back to Dashboard</Button>
      </div>
    );
  }

  const handleAddComment = () => {
    if (!commentText.trim()) { setCommentError('Comment cannot be empty'); return; }
    if (!user) return;
    addComment(complaint.id, { text: commentText.trim(), userId: user.id, userName: user.name });
    setCommentText('');
    setCommentError('');
  };

  const currentStepIndex = STATUS_STEPS.indexOf(complaint.status);

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Complaint Details</h1>
        <Button variant="secondary" size="sm" onClick={() => navigate('/')}>← Back</Button>
      </div>

      {/* Main Info */}
      <Card>
        <div className="flex justify-between items-start gap-4 mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{complaint.title}</h2>
          <Badge variant={STATUS_BADGE_VARIANT[complaint.status]}>
            {STATUS_LABELS[complaint.status]}
          </Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
          {[
            { label: 'Category', value: complaint.category },
            { label: 'Reported by', value: complaint.userName },
            { label: 'Date', value: new Date(complaint.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
            { label: 'Assigned to', value: complaint.assignedTo || 'Unassigned' },
          ].map(({ label, value }) => (
            <div key={label} className="bg-gray-50 dark:bg-gray-700/50 rounded-md p-3">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
              <p className="font-medium text-gray-900 dark:text-white text-sm">{value}</p>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Priority</p>
          <span className={`font-semibold capitalize ${PRIORITY_COLORS[complaint.priority]}`}>
            ▲ {complaint.priority}
          </span>
        </div>

        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Description</p>
          <p className="text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-md text-sm leading-relaxed">
            {complaint.description}
          </p>
        </div>

        {complaint.imageUrl && (
          <div className="mt-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Attached Image</p>
            <img src={complaint.imageUrl} alt="Complaint" className="max-w-sm rounded-md border border-gray-200 dark:border-gray-700" />
          </div>
        )}
      </Card>

      {/* Status Timeline */}
      <Card>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-5">Status Timeline</h3>
        <div className="flex items-center gap-0">
          {STATUS_STEPS.map((step, i) => {
            const done = i <= currentStepIndex;
            return (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors
                    ${done ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'}`}>
                    {done ? '✓' : i + 1}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${done ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>
                    {STATUS_LABELS[step]}
                  </span>
                </div>
                {i < STATUS_STEPS.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 mb-5 rounded ${i < currentStepIndex ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {user?.role === 'admin' && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Change Status:</p>
            <div className="flex gap-2 flex-wrap">
              {STATUS_STEPS.map(s => (
                <Button
                  key={s}
                  size="sm"
                  variant={complaint.status === s ? 'primary' : 'ghost'}
                  onClick={() => updateComplaint(complaint.id, { status: s })}
                >
                  {STATUS_LABELS[s]}
                </Button>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Comments */}
      <Card>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
          Comments ({complaint.comments.length})
        </h3>

        <div className="space-y-4 mb-6">
          {complaint.comments.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500 italic">No comments yet. Be the first to comment.</p>
          ) : (
            complaint.comments.map(comment => (
              <div key={comment.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-sm font-bold text-blue-700 dark:text-blue-300 shrink-0">
                  {comment.userName[0].toUpperCase()}
                </div>
                <div className="flex-1 bg-gray-50 dark:bg-gray-700/50 rounded-md p-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{comment.userName}</span>
                    <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{comment.text}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {user && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <textarea
              value={commentText}
              onChange={e => { setCommentText(e.target.value); setCommentError(''); }}
              placeholder="Write a comment..."
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md
                bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            />
            {commentError && <p className="text-xs text-red-500 mb-2">{commentError}</p>}
            <Button size="sm" onClick={handleAddComment}>Post Comment</Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ComplaintDetails;
