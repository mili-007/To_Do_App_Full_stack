import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiEdit } from 'react-icons/fi';
import { HiOutlineTrash } from 'react-icons/hi';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../app/store';
import { PRIORITY_BADGE_CLASSES } from '../../constants/todo';
import { getCategories } from '../../features/categories/categorySlice';
import { getProjects } from '../../features/projects/projectSlice';
import type { Todo, TodoDetailViewProps, TodoEditFormValues } from '../../types';
import Button from '../ui/Button';

function getEditDefaultValues(todo: Todo): TodoEditFormValues {
  return {
    title: todo.title,
    description: todo.description || '',
    priority: todo.priority,
    dueDate: todo.dueDate ? todo.dueDate.split('T')[0] : '',
    project: typeof todo.project === 'object' ? todo?.project?._id ?? null : (todo.project || null),
    categories: Array.isArray(todo.categories)
      ? todo.categories.map((cat) => (typeof cat === 'object' ? cat._id : cat)).filter(Boolean)
      : []
  };
}

const TodoDetailView = ({ todo, onUpdate, onDelete, onEdit, isOwner }: TodoDetailViewProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { reset } = useForm<TodoEditFormValues>({ defaultValues: getEditDefaultValues(todo) });
  const dispatch = useDispatch<AppDispatch>();


  useEffect(() => {
    if (isEditing) {
      reset(getEditDefaultValues(todo));
    }
  }, [isEditing]);

  const toggleComplete = () => {
    onUpdate({ completed: !todo.completed });
  };

  const startEditing = () => {
    dispatch(getProjects());
    dispatch(getCategories());
    setIsEditing(true);
  };

  const handleEditClick = () => {
    if (onEdit) onEdit();
    else startEditing();
  };

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
              className="!p-1"
              onClick={handleEditClick}
              title="View details"
            >
              <FiEdit className="w-4 h-4" aria-hidden />
            </Button>
            <Button
              type="button"
              variant="ghostDanger"
              size="icon"
              onClick={onDelete}
              title="Delete todo"
            >
              <HiOutlineTrash className="w-4 h-4" aria-hidden />
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
        <div className="flex flex-wrap items-center gap-3">
          <span className={`badge ${PRIORITY_BADGE_CLASSES[todo.priority]}`}>
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
              <>
                <span
                  className="inline-block text-sm px-2 py-1 rounded-full text-white font-small"
                  style={{ backgroundColor: typeof todo.project === 'object' ? todo.project.color : '#3B82F6' }}>
                  {typeof todo.project === 'object' ? todo.project.name : ''}
                </span>
              </>
            ) : (
              <span className="text-sm text-gray-400">No project</span>
            )}
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Categories</span>
            {todo.categories && todo.categories.filter((c): c is NonNullable<typeof c> => c != null).length > 0 ? (
              <>
                {todo.categories
                  .filter((cat): cat is NonNullable<typeof cat> => cat != null)
                  .map((cat) => (
                    <span
                      className="inline-block text-sm px-2 py-1 rounded-full text-white font-small"
                      style={{ backgroundColor: typeof cat === 'object' ? cat.color : '#3B82F6' }}>
                      {typeof cat === 'object' ? cat.name : ''}
                    </span>
                  ))}
              </>
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
