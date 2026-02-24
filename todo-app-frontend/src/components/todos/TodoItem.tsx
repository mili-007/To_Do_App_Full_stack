import { FiEdit } from 'react-icons/fi';
import { HiOutlineEye, HiOutlineTrash } from 'react-icons/hi';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../app/store';
import { PRIORITY_BADGE_CLASSES } from '../../constants/todo';
import { deleteTodo, getTodos, updateTodo } from '../../features/todos/todoSlice';
import { useDeleteConfirm } from '../../hooks/useDeleteConfirm';
import type { TodoItemProps } from '../../types';
import { toast } from '../../utils/toast';
import Button from '../ui/Button';
import ConfirmDialog from '../ui/ConfirmDialog';

const TodoItem = ({ todo, onView, onEdit }: TodoItemProps) => {
  const dispatch = useDispatch<AppDispatch>();
  // const { user } = useSelector((state: RootState) => state.auth);

  const deleteConfirm = useDeleteConfirm<string>();

  const handleDeleteConfirm = () => {
    if (deleteConfirm.target === null) return;
    deleteConfirm.close();
    dispatch(deleteTodo(deleteConfirm.target))
      .unwrap()
      .then((payload) => {
        toast.success(payload?.message || 'Todo deleted');
        dispatch(getTodos());
      })
      .catch((err: string) => toast.error(err || 'Failed to delete todo'));
  };

  const toggleComplete = () => {
    dispatch(updateTodo({ id: todo._id, todoData: { completed: !todo.completed } }));
  };

  const cardClass = `rounded-lg border bg-white shadow-sm transition-all duration-200 ${todo.completed ? 'bg-gray-50 border-gray-200 opacity-75' : 'border-gray-200 hover:border-indigo-300'} p-3`;

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
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={toggleComplete}
          className="h-4 w-4 shrink-0 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
        />
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm font-medium text-gray-800 truncate ${todo.completed ? 'line-through text-gray-400' : ''} group-hover:text-indigo-600`}
            title={todo.title}
          >
            {todo.title}
          </p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className={`badge text-[10px] px-1.5 py-0 ${PRIORITY_BADGE_CLASSES[todo.priority]}`}>
              {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
            </span>
            {todo.dueDate && (
              <span className="text-[10px] text-gray-500">
                Due{' '}
                {new Date(todo.dueDate).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric'
                })}
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
              {onEdit && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="!p-1"
                  onClick={() => onEdit(todo)}
                  title="Edit todo"
                >
                  <FiEdit className="w-4 h-4" aria-hidden />
                </Button>
              )}
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
        </div>
      </div>
    </div>
  );
};

export default TodoItem;
