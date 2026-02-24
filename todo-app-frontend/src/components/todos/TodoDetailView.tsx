import { useState } from 'react';
import { PRIORITY_BADGE_CLASSES } from '../../constants/todo';
import type { TodoDetailViewProps } from '../../types';
import ConfirmDialog from '../ui/ConfirmDialog';
import Button from '../ui/Button';
import { FiEdit } from 'react-icons/fi';
import { HiOutlineTrash } from 'react-icons/hi';


const TodoDetailView = ({ todo, onUpdate, onDelete, onEdit }: TodoDetailViewProps) => {
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);

  const toggleComplete = () => {
    if (!todo.completed) {
      setShowCompleteConfirm(true);
    } else {
      onUpdate({ completed: false });
    }
  };

  const handleConfirmComplete = () => {
    setShowCompleteConfirm(false);
    onUpdate({ completed: true });
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
        <div className="flex space-x-2">
          {onEdit && !todo.completed && (
            <>
            <Button
              variant="ghost"
              size="icon"
              onClick={onEdit}
              title="Edit todo"
            >
              <FiEdit className="w-5 h-5" />
            </Button>
          <Button
            variant="ghostDanger"
            size="icon"
            onClick={onDelete}
            title="Delete todo"
          >
            <HiOutlineTrash className="w-5 h-5" />
          </Button>
          </>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={showCompleteConfirm}
        title="Complete task"
        message="Are you sure you want to mark this task as completed? You won't be able to edit it afterwards."
        confirmLabel="Complete"
        variant="warning"
        onConfirm={handleConfirmComplete}
        onCancel={() => setShowCompleteConfirm(false)}
      />



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
            {todo.categories && todo.categories.length > 0 ? (
              <>
                {todo.categories?.map((cat) => (
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
