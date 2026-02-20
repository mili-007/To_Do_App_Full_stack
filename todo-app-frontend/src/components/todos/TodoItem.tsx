import { useState, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { toast } from '../../utils/toast';
import { useDispatch, useSelector } from 'react-redux';
import { updateTodo, deleteTodo } from '../../features/todos/todoSlice';
import { getProjects } from '../../features/projects/projectSlice';
import { getCategories } from '../../features/categories/categorySlice';
import type { AppDispatch, RootState } from '../../app/store';
import type { Todo, TodoFormData } from '../../types';
import { HiOutlineEye, HiOutlineTrash } from 'react-icons/hi';
import { FiEdit } from 'react-icons/fi';
import ConfirmDialog from '../ui/ConfirmDialog';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useDeleteConfirm } from '../../hooks/useDeleteConfirm';

/** Today in local YYYY-MM-DD for due date min (no past dates). */
const getTodayMinDate = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

interface TodoItemProps {
  todo: Todo;
  /** Compact card for board view (~5 visible without scroll) */
  compact?: boolean;
  /** When set, View button opens this todo in parent's modal */
  onView?: (todo: Todo) => void;
}

type EditFormErrors = Partial<Record<'title' | 'dueDate', string>>;

const TodoItem = ({ todo, compact = false, onView }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editErrors, setEditErrors] = useState<EditFormErrors>({});
  const dueDateStr = todo.dueDate ? todo.dueDate.split('T')[0] : '';
  const isPastDue = dueDateStr && dueDateStr < getTodayMinDate();
  const [editData, setEditData] = useState<Omit<TodoFormData, 'description'> & { description: string; completed: boolean; project?: string | null; categories?: string[] }>({
    title: todo.title,
    description: todo.description || '',
    priority: todo.priority,
    dueDate: isPastDue ? '' : dueDateStr,
    completed: todo.completed,
    project: todo.project != null && typeof todo.project === 'object' ? todo.project._id : (typeof todo.project === 'string' ? todo.project : null),
    categories: Array.isArray(todo.categories)
      ? todo.categories.map(cat => (cat != null && typeof cat === 'object' ? cat._id : cat)).filter(Boolean)
      : []
  });
  
  const dispatch = useDispatch<AppDispatch>();
  const { projects } = useSelector((state: RootState) => state.projects);
  const { categories: availableCategories } = useSelector((state: RootState) => state.categories);
  const { user } = useSelector((state: RootState) => state.auth);
  
  // Check if current user is owner
  const isOwner = typeof todo.user === 'object' 
    ? todo.user._id === user?._id 
    : todo.user === user?._id;
  
  const priorityColors: Record<string, string> = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };
  
  const handleUpdate = () => {
    const err: EditFormErrors = {};
    if (!editData.title.trim()) err.title = 'Title is required';
    if (editData.dueDate && editData.dueDate < getTodayMinDate()) {
      err.dueDate = 'Due date cannot be in the past. Please select today or a future date.';
    }
    setEditErrors(err);
    if (Object.keys(err).length > 0) return;
    dispatch(updateTodo({ id: todo._id, todoData: editData }));
    setIsEditing(false);
  };
  
  const deleteConfirm = useDeleteConfirm<string>();

  const handleDeleteConfirm = () => {
    if (deleteConfirm.target === null) return;
    deleteConfirm.close();
    dispatch(deleteTodo(deleteConfirm.target))
      .unwrap()
      .then(() => toast.success('Todo deleted'))
      .catch((err: string) => toast.error(err || 'Failed to delete todo'));
  };

  const toggleComplete = () => {
    dispatch(updateTodo({ 
      id: todo._id, 
      todoData: { ...todo, completed: !todo.completed } 
    }));
  };
  
  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditData((prevState) => ({ ...prevState, [name]: value }));
    if (editErrors[name as keyof EditFormErrors]) {
      setEditErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };
  
  const cardClass = compact
    ? `rounded-lg border bg-white shadow-sm transition-all duration-200 ${todo.completed ? 'bg-gray-50 border-gray-200 opacity-75' : 'border-gray-200 hover:border-indigo-300'} p-3`
    : `card transition-all duration-200 ${todo.completed ? 'bg-gray-50 border-gray-200 opacity-75' : 'bg-white border-gray-200 hover:border-indigo-300'}`;

  return (
    <div className={cardClass}>
      <ConfirmDialog
        open={deleteConfirm.isOpen}
        title="Delete todo"
        message="Are you sure you want to delete this todo?"
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={deleteConfirm.close}
      />
      {isEditing ? (
        <div className="space-y-4">
          <Input
            type="text"
            name="title"
            value={editData.title}
            onChange={onChange}
            placeholder="Todo title"
            required
            error={editErrors.title}
          />
          <textarea
            className="input-field resize-none"
            name="description"
            value={editData.description}
            onChange={onChange}
            placeholder="Description (optional)"
            rows={3}
          />
          <div className="grid grid-cols-2 gap-3">
            <select
              className="input-field"
              name="priority"
              value={editData.priority}
              onChange={onChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <Input
              type="date"
              name="dueDate"
              value={editData.dueDate}
              min={getTodayMinDate()}
              onChange={onChange}
              error={editErrors.dueDate}
            />
          </div>
          {isOwner && (
            <>
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">Project</label>
                <select
                  className="input-field"
                  value={editData.project || ''}
                  onChange={(e) => setEditData(prev => ({ ...prev, project: e.target.value || null }))}
                >
                  <option value="">No Project</option>
                  {projects.map((proj) => (
                    <option key={proj._id} value={proj._id}>
                      {proj.name}
                    </option>
                  ))}
                </select>
              </div>
              {availableCategories.length > 0 && (
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Categories</label>
                  <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-lg bg-gray-50">
                    {availableCategories.map((cat) => (
                      <button
                        key={cat._id}
                        type="button"
                        onClick={() => {
                          const currentCategories = editData.categories || [];
                          setEditData(prev => ({
                            ...prev,
                            categories: currentCategories.includes(cat._id)
                              ? currentCategories.filter(id => id !== cat._id)
                              : [...currentCategories, cat._id]
                          }));
                        }}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                          editData.categories?.includes(cat._id)
                            ? 'text-white shadow-md'
                            : 'bg-white text-gray-700 border border-gray-300 hover:border-indigo-400'
                        }`}
                        style={editData.categories?.includes(cat._id) ? { backgroundColor: cat.color } : {}}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
          <div className="flex space-x-3 pt-2">
            <Button
              type="button"
              variant="success"
              size="sm"
              onClick={handleUpdate}
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
      ) : compact ? (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={toggleComplete}
            className="h-4 w-4 shrink-0 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
          />
          <div className="flex-1 min-w-0">
            {onView ? (
              <button
                type="button"
                onClick={() => onView(todo)}
                className="text-left w-full block group"
              >
                <p className={`text-sm font-medium text-gray-800 truncate ${todo.completed ? 'line-through text-gray-400' : ''} group-hover:text-indigo-600`} title={todo.title}>
                  {todo.title}
                </p>
              </button>
            ) : (
              <Link to={`/todos/${todo._id}`} className="block group">
                <p className={`text-sm font-medium text-gray-800 truncate ${todo.completed ? 'line-through text-gray-400' : ''} group-hover:text-indigo-600`} title={todo.title}>
                  {todo.title}
                </p>
              </Link>
            )}
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className={`badge text-[10px] px-1.5 py-0 ${priorityColors[todo.priority]}`}>
                {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
              </span>
              {todo.dueDate && (
                <span className="text-[10px] text-gray-500">
                  Due {new Date(todo.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              )}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-0">
            {onView && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="!p-1"
                onClick={() => onView(todo)}
                title="View details"
              >
                <HiOutlineEye className="w-4 h-4 text-indigo-600" aria-hidden />
              </Button>
            )}
            {isOwner && (
            <>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="!p-1"
                onClick={() => {
                  dispatch(getProjects());
                  dispatch(getCategories());
                  setIsEditing(true);
                }}
                title="Edit todo"
              >
                <FiEdit className="w-4 h-4" aria-hidden />
              </Button>
              <Button
                type="button"
                variant="ghostDanger"
                size="icon"
                className="!p-1"
                onClick={() => deleteConfirm.requestDelete(todo._id)}
                title="Delete todo"
              >
                <HiOutlineTrash className="w-4 h-4" aria-hidden />
              </Button>
            </>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 pt-1">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={toggleComplete}
              className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className={`text-lg font-semibold text-gray-800 ${todo.completed ? 'line-through text-gray-400' : ''}`}>
                  {todo.title}
                </h3>
                {todo.description && (
                  <p className={`mt-2 text-gray-600 text-sm ${todo.completed ? 'line-through text-gray-400' : ''}`}>
                    {todo.description}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-3 mt-4">
                  <span className={`badge ${priorityColors[todo.priority]}`}>
                    {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)} Priority
                  </span>
                  <span className="text-xs text-gray-500">
                    Project:{' '}
                    {todo.project ? (
                      <Link
                        to="/projects"
                        className="text-xs px-2 py-1 rounded-full text-white font-medium hover:opacity-80 transition-opacity"
                        style={{
                          backgroundColor: typeof todo.project === 'object' ? todo.project.color : '#3B82F6'
                        }}
                      >
                        {typeof todo.project === 'object' ? todo.project.name : 'Project'}
                      </Link>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </span>
                  <span className="text-xs text-gray-500">
                    Categories:{' '}
                    {todo.categories && todo.categories.filter((c): c is NonNullable<typeof c> => c != null).length > 0 ? (
                      <span className="inline-flex flex-wrap gap-1">
                        {todo.categories
                          .filter((cat): cat is NonNullable<typeof cat> => cat != null)
                          .map((cat) => (
                            <span
                              key={typeof cat === 'object' ? cat._id : cat}
                              className="px-2 py-0.5 rounded-full text-white font-medium"
                              style={{
                                backgroundColor: typeof cat === 'object' ? cat.color : '#10B981'
                              }}
                            >
                              {typeof cat === 'object' ? cat.name : 'Category'}
                            </span>
                          ))}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </span>
                  {todo.sharedWith && todo.sharedWith.length > 0 && (
                    <span className="text-xs text-gray-500 flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>Shared with {todo.sharedWith.length} user(s)</span>
                    </span>
                  )}
                  {todo.dueDate && (
                    <span className="text-xs text-gray-500 flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Due: {new Date(todo.dueDate).toLocaleDateString()}</span>
                    </span>
                  )}
                  <span className="text-xs text-gray-400">
                    Created: {new Date(todo.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <Link
                  to={`/todos/${todo._id}`}
                  className="inline-flex items-center mt-3 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  View Details →
                </Link>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 flex space-x-2">
            {isOwner && (
              <>
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
                  <FiEdit className="w-5 h-5" aria-hidden />
                </Button>
                <Button
                  type="button"
                  variant="ghostDanger"
                  size="icon"
                  onClick={() => deleteConfirm.requestDelete(todo._id)}
                  title="Delete todo"
                >
                  <HiOutlineTrash className="w-5 h-5" aria-hidden />
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoItem;

