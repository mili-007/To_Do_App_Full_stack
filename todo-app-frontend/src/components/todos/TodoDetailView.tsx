import { PRIORITY_BADGE_CLASSES } from '../../constants/todo';
import type { TodoDetailViewProps } from '../../types';

const TodoDetailView = ({ todo, onUpdate }: TodoDetailViewProps) => {

  const toggleComplete = () => {
    onUpdate({ completed: !todo.completed });
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
            {todo.categories && todo.categories.length > 0  ? (
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
