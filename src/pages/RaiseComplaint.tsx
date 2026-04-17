import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useComplaints } from '../context/ComplaintContext';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES, Priority } from '../types';
import { useForm } from '../hooks/useForm';
import Card from '../components/Card';
import Input from '../components/Input';
import Select from '../components/Select';
import Button from '../components/Button';

const RaiseComplaint: React.FC = () => {
  const { addComplaint } = useComplaints();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [image, setImage] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const { values, errors, set, blur, validate } = useForm(
    { title: '', description: '', category: '', priority: 'medium' },
    {
      title: v => !v.trim() ? 'Title is required' : v.trim().length < 5 ? 'Min 5 characters' : undefined,
      description: v => !v.trim() ? 'Description is required' : v.trim().length < 10 ? 'Min 10 characters' : undefined,
      category: v => !v ? 'Please select a category' : undefined,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !validate()) return;

    addComplaint({
      title: values.title.trim(),
      description: values.description.trim(),
      category: values.category,
      status: 'open',
      priority: values.priority as Priority,
      userId: user.id,
      userName: user.name,
      imageUrl: image ? URL.createObjectURL(image) : undefined,
    });

    setSubmitted(true);
    setTimeout(() => navigate('/'), 1200);
  };

  if (!user) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 dark:text-gray-400 text-lg">Please log in to raise a complaint.</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Complaint Submitted!</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Raise New Complaint</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Fill in the details below. We'll get back to you as soon as possible.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <Input
            id="title" label="Title *" type="text"
            placeholder="Brief title for your complaint"
            value={values.title} onChange={set('title')} onBlur={blur('title')} error={errors.title}
          />

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description *
            </label>
            <textarea
              id="description" rows={4}
              placeholder="Describe the issue in detail..."
              value={values.description}
              onChange={set('description')}
              onBlur={blur('description')}
              className={`w-full px-3 py-2 border rounded-md text-sm
                bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                placeholder-gray-400 dark:placeholder-gray-500
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${errors.description ? 'border-red-400 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
            />
            {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              id="category" label="Category *"
              value={values.category} onChange={set('category')} onBlur={blur('category')}
              error={errors.category}
              options={[
                { value: '', label: 'Select a category' },
                ...CATEGORIES.map(c => ({ value: c, label: c }))
              ]}
            />
            <Select
              id="priority" label="Priority"
              value={values.priority} onChange={set('priority')}
              options={[
                { value: 'low', label: '🟢 Low' },
                { value: 'medium', label: '🟡 Medium' },
                { value: 'high', label: '🔴 High' },
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Attach Image (Optional)
            </label>
            <input
              type="file" accept="image/*"
              onChange={e => setImage(e.target.files?.[0] ?? null)}
              className="w-full text-sm text-gray-500 dark:text-gray-400
                file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0
                file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700
                dark:file:bg-blue-900/30 dark:file:text-blue-300
                hover:file:bg-blue-100 dark:hover:file:bg-blue-900/50"
            />
            {image && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                📎 {image.name}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" fullWidth>Submit Complaint</Button>
            <Button type="button" variant="ghost" onClick={() => navigate('/')}>Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default RaiseComplaint;
