import { useEffect, useMemo, useState } from 'react';
import { toast } from '../../utils/toast';
import { useSelector, useDispatch } from 'react-redux';
import { getTodos, reset, updateTodo, deleteTodo } from '../../features/todos/todoSlice';
import { getComments } from '../../features/comments/commentSlice';
import type { RootState, AppDispatch } from '../../app/store';
import type { Todo } from '../../types';
import TodoItem from './TodoItem';
import TodoDetailView from './TodoDetailView';
import CommentSection from '../comments/CommentSection';
import Modal from '../ui/Modal';
import ConfirmDialog from '../ui/ConfirmDialog';
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

const TodoList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [viewTodoId, setViewTodoId] = useState<string | null>(null);
  const deleteConfirm = useDeleteConfirm<string>();

  const { todos, isLoading, isError, message } = useSelector(
    (state: RootState) => state.todos
  );

  const { user } = useSelector((state: RootState) => state.auth);

  const byPriority = useMemo(() => groupByPriority(todos), [todos]);
  const viewTodo = viewTodoId ? todos.find((t) => t._id === viewTodoId) ?? null : null;

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
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[320px]">
      {todos.length === 0 ? (
        <div className="card text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-gray-600 font-medium text-lg mb-2">No todos found</p>
            <p className="text-gray-500 text-sm">Add your first todo to get started!</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* <div className="text-xs text-gray-500 flex items-center gap-3">
            <span className="font-semibold uppercase tracking-wide text-gray-600">Quick filters:</span>
            <button type="button" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Only My Issues
            </button>
            <button type="button" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Recently Updated
            </button>
          </div> */}

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
                        compact
                        onView={(t) => setViewTodoId(t._id)}
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

