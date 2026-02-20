import { useEffect, useMemo, useState } from 'react';
import { toast } from '../../utils/toast';
import { useDispatch, useSelector } from 'react-redux';
import { getTodos, reset, updateTodo, deleteTodo } from '../../features/todos/todoSlice';
import type { AppDispatch, RootState } from '../../app/store';
import { getComments } from '../../features/comments/commentSlice';
import type { Todo } from '../../types';
import TodoItem from './TodoItem';
import TodoDetailView from './TodoDetailView';
import CommentSection from '../comments/CommentSection';
import Modal from '../ui/Modal';
import ConfirmDialog from '../ui/ConfirmDialog';
import LoadingSpinner from '../ui/LoadingSpinner';
import EmptyState from '../ui/EmptyState';
import { useDeleteConfirm } from '../../hooks/useDeleteConfirm';

const PRIORITIES = ['high', 'medium', 'low'] as const;
const PRIORITY_LABELS: Record<string, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

const groupByPriority = (todos: Todo[]): Record<string, Todo[]> => {
  const groups: Record<string, Todo[]> = { high: [], medium: [], low: [] };
  for (const todo of todos) {
    const p = (todo.priority || 'medium').toLowerCase();
    if (groups[p]) groups[p].push(todo);
    else groups.medium.push(todo);
  }
  return groups;
};

interface TodoListProps {
  /** When provided, Edit button opens Add/Edit modal with this todo instead of inline edit */
  onEditTodo?: (todo: Todo) => void;
}

const TodoList = ({ onEditTodo }: TodoListProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [viewTodoId, setViewTodoId] = useState<string | null>(null);
  const deleteConfirm = useDeleteConfirm<string>();

  const { todos, isLoading, isError, message } = useSelector((state: RootState) => state.todos);
  const { user } = useSelector((state: RootState) => state.auth);

  const byPriority = useMemo(() => groupByPriority(todos), [todos]);
  const viewTodo = viewTodoId ? todos.find((t) => t._id === viewTodoId) ?? null : null;

  const handleEditFromView = (todo: Todo) => {
    setViewTodoId(null);
    onEditTodo?.(todo);
  };

  useEffect(() => {
    if (viewTodoId) dispatch(getComments(viewTodoId));
  }, [viewTodoId, dispatch]);

  useEffect(() => {
    if (
      isError &&
      message &&
      (message.includes('Not authorized') ||
        message.includes('token expired') ||
        message.includes('invalid token') ||
        message.includes('no token'))
    ) {
      dispatch(reset());
      return;
    }
    if (isError && message) {
      toast.error(message);
      dispatch(reset());
    }
  }, [isError, message, dispatch]);

  useEffect(() => {
    if (user) dispatch(getTodos());
    return () => { dispatch(reset()); };
  }, [user, dispatch]);

  const handleDeleteConfirm = () => {
    if (deleteConfirm.target === null) return;
    const id = deleteConfirm.target;
    deleteConfirm.close();
    dispatch(deleteTodo(id))
      .unwrap()
      .then(() => {
        toast.success('Todo deleted');
        setViewTodoId(null);
      })
      .catch((err: string) => toast.error(err || 'Failed to delete todo'));
  };

  if (isLoading) {
    return (
      <div className="card">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-[320px]">
      {todos.length === 0 ? (
        <EmptyState
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
          title="No todos found"
          subtitle="Add your first todo to get started!"
        />
      ) : (
        <div className="space-y-3">
          <div className="flex gap-4 overflow-x-auto pb-2">
            {PRIORITIES?.map((priority) => {
              const columnTodos = byPriority[priority] ?? [];
              return (
                <div
                  key={priority}
                  className="min-w-[280px] flex-1 rounded-lg border border-gray-200 bg-gray-50/80 flex flex-col"
                >
                  <div className="px-3 py-2 flex items-center justify-between">
                    <span className="text-[14px] font-bold uppercase tracking-wide text-gray-700">
                      {PRIORITY_LABELS[priority]}
                    </span>
                    <span className="text-[11px] font-semibold text-gray-700 bg-white/80 px-2 py-0.5 rounded-full border border-gray-200">
                      {columnTodos.length}
                    </span>
                  </div>
                  <div className="h-px bg-gray-200/80" />
                  <div className="flex-1 p-2 space-y-2 overflow-y-auto min-h-0 max-h-[420px]">
                    {columnTodos?.map((todo) => (
                      <TodoItem
                        key={todo._id}
                        todo={todo}
                        onView={(t) => setViewTodoId(t._id)}
                        onEdit={onEditTodo}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={deleteConfirm.isOpen}
        title="Delete todo"
        message="Are you sure you want to delete this todo?"
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={deleteConfirm.close}
      />

      <Modal
        open={Boolean(viewTodoId)}
        onClose={() => setViewTodoId(null)}
        title="Todo Details"
      >
        {!viewTodo ? (
          <p className="text-gray-500">Todo not found.</p>
        ) : (
          <div className="space-y-6">
            <TodoDetailView
              todo={viewTodo}
              onUpdate={(todoData) => dispatch(updateTodo({ id: viewTodo._id, todoData }))}
              onDelete={() => deleteConfirm.requestDelete(viewTodo._id)}
              onEdit={onEditTodo ? () => handleEditFromView(viewTodo) : undefined}
              isOwner={
                typeof viewTodo.user === 'object'
                  ? viewTodo.user._id === user?._id
                  : viewTodo.user === user?._id
              }
            />
            <CommentSection todoId={viewTodo._id} />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TodoList;

