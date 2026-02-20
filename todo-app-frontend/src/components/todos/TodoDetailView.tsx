import { useState, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProjects } from '../../features/projects/projectSlice';
import { getCategories } from '../../features/categories/categorySlice';
import type { AppDispatch, RootState } from '../../app/store';
import type { Todo } from '../../types';
import Button from '../ui/Button';

interface TodoDetailViewProps {
  todo: Todo;
  onUpdate: (todoData: any) => void;
  onDelete: () => void;
  isOwner: boolean;
}

const TodoDetailView = ({ todo, onUpdate, onDelete, isOwner }: TodoDetailViewProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: todo.title,
    description: todo.description || '',
    priority: todo.priority,
    dueDate: todo.dueDate ? todo.dueDate.split('T')[0] : '',
    completed: todo.completed,
    project: typeof todo.project === 'object' ? todo?.project?._id : todo.project || null,
    categories: Array.isArray(todo.categories)
      ? todo.categories.map(cat => typeof cat === 'object' ? cat._id : cat)
      : []
  });

  const dispatch = useDispatch<AppDispatch>();
  const { projects } = useSelector((state: RootState) => state.projects);
  const { categories: availableCategories } = useSelector((state: RootState) => state.categories);

  const priorityColors: Record<string, string> = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  const toggleComplete = () => {
    onUpdate({ completed: !todo.completed });
  };

  const handleCategoryToggle = (categoryId: string) => {
    setEditData(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  if (isEditing && isOwner) {
    return (
      <div className="card bg-white/90 backdrop-blur-sm border border-gray-200">
        <div className="space-y-4">
          <input
            className="input-field text-xl font-bold"
            type="text"
            value={editData.title}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEditData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Todo title"
          />
          <textarea
            className="input-field resize-none"
            value={editData.description}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setEditData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Description (optional)"
            rows={5}
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">Priority</label>
              <select
                className="input-field"
                value={editData.priority}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setEditData(prev => ({ ...prev, priority: e.target.value as any }))}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">Due Date</label>
              <input
                className="input-field"
                type="date"
                value={editData.dueDate}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEditData(prev => ({ ...prev, dueDate: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Project</label>
            <select
              className="input-field"
              value={editData.project || ''}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                dispatch(getProjects());
                setEditData(prev => ({ ...prev, project: e.target.value || null }));
              }}
            >
              <option value="">No Project</option>
              {projects?.map((proj) => (
                <option key={proj._id} value={proj._id}>
                  {proj.name}
                </option>
              ))}
            </select>
          </div>
          {availableCategories.length > 0 && (
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">Categories</label>
              <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg bg-gray-50">
                {availableCategories?.map((cat) => (
                  <button
                    key={cat._id}
                    type="button"
                    onClick={() => {
                      dispatch(getCategories());
                      handleCategoryToggle(cat._id);
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      editData.categories.includes(cat._id)
                        ? 'text-white shadow-md'
                        : 'bg-white text-gray-700 border border-gray-300 hover:border-indigo-400'
                    }`}
                    style={editData.categories.includes(cat._id) ? { backgroundColor: cat.color } : {}}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="flex space-x-3 pt-2">
            <Button
              type="button"
              variant="success"
              size="sm"
              onClick={handleSave}
              className="flex-1"
            >
              Save Changes
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsEditing(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-white/90 backdrop-blur-sm border border-gray-200">
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-4">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={toggleComplete}
              className="h-6 w-6 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
            />
            <h2 className={`text-3xl font-bold ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
              {todo.title}
            </h2>
          </div>
          {todo.description && (
            <p className={`text-gray-600 mb-6 ${todo.completed ? 'line-through text-gray-400' : ''}`}>
              {todo.description}
            </p>
          )}
        </div>
        {isOwner && (
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => {
                dispatch(getProjects());
                dispatch(getCategories());
                setIsEditing(true);
              }}
              title="Edit todo"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Button>
            <Button
              type="button"
              variant="ghostDanger"
              size="icon"
              onClick={onDelete}
              title="Delete todo"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
        <div className="flex flex-wrap items-center gap-3">
          <span className={`badge ${priorityColors[todo.priority]}`}>
            {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)} Priority
          </span>
          {todo.dueDate && (
            <span className="text-sm text-gray-500 flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Due: {new Date(todo.dueDate).toLocaleDateString()}</span>
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-4">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Project</span>
            {todo.project ? (
              <Link
                to="/projects"
                className="inline-block text-sm px-3 py-1.5 rounded-full text-white font-medium hover:opacity-80 transition-opacity"
                style={{ backgroundColor: typeof todo.project === 'object' ? todo.project.color : '#3B82F6' }}
              >
                {typeof todo.project === 'object' ? todo.project.name : 'Project'}
              </Link>
            ) : (
              <span className="text-sm text-gray-400">No project</span>
            )}
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Categories</span>
            {todo.categories && todo.categories.filter((c): c is NonNullable<typeof c> => c != null).length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {todo.categories
                  .filter((cat): cat is NonNullable<typeof cat> => cat != null)
                  .map((cat) => (
                    <span
                      key={typeof cat === 'object' ? cat._id : cat}
                      className="text-xs px-2 py-1 rounded-full text-white font-medium"
                      style={{ backgroundColor: typeof cat === 'object' ? cat.color : '#10B981' }}
                    >
                      {typeof cat === 'object' ? cat.name : 'Category'}
                    </span>
                  ))}
              </div>
            ) : (
              <span className="text-sm text-gray-400">No categories</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoDetailView;

