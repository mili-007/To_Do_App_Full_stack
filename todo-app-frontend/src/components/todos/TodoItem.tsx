import { useState, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateTodo, deleteTodo } from '../../features/todos/todoSlice';
import { getProjects } from '../../features/projects/projectSlice';
import { getCategories } from '../../features/categories/categorySlice';
import type { AppDispatch, RootState } from '../../app/store';
import type { Todo, TodoFormData } from '../../types';

/** Today in local YYYY-MM-DD for due date min (no past dates). */
const getTodayMinDate = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

interface TodoItemProps {
  todo: Todo;
}

type EditFormErrors = Partial<Record<'title' | 'dueDate', string>>;

const TodoItem = ({ todo }: TodoItemProps) => {
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
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      dispatch(deleteTodo(todo._id));
    }
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
  
  return (
    <div className={`card transition-all duration-200 ${todo.completed ? 'bg-gray-50 border-gray-200 opacity-75' : 'bg-white border-gray-200 hover:border-indigo-300'}`}>
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <input
              className={`input-field ${editErrors.title ? 'border-red-500 focus:ring-red-500' : ''}`}
              type="text"
              name="title"
              value={editData.title}
              onChange={onChange}
              placeholder="Todo title"
              aria-invalid={!!editErrors.title}
            />
            {editErrors.title && (
              <p className="mt-1 text-sm text-red-600" role="alert">{editErrors.title}</p>
            )}
          </div>
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
            <input
              className={`input-field ${editErrors.dueDate ? 'border-red-500 focus:ring-red-500' : ''}`}
              type="date"
              name="dueDate"
              value={editData.dueDate}
              min={getTodayMinDate()}
              onChange={onChange}
              title="Select today or a future date"
              aria-invalid={!!editErrors.dueDate}
            />
            {editErrors.dueDate && (
              <p className="mt-1 text-sm text-red-600" role="alert">{editErrors.dueDate}</p>
            )}
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
            <button
              onClick={handleUpdate}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Save Changes
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
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
                <button
                  onClick={() => {
                    dispatch(getProjects());
                    dispatch(getCategories());
                    setIsEditing(true);
                  }}
                  className="p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                  title="Edit todo"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  title="Delete todo"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoItem;

