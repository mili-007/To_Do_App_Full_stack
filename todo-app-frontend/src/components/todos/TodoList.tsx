import { useEffect, useMemo, useState } from 'react';
import { toast } from '../../utils/toast';
import { useDispatch, useSelector } from 'react-redux';
import { getTodos, reset, updateTodo, deleteTodo, getTodoById, setFilterProjectId } from '../../features/todos/todoSlice';
import { getProject, clearSelectedProject } from '../../features/projects/projectSlice';
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
  onEditTodo?: (todo: Todo) => void;
}

const TodoList = ({ onEditTodo }: TodoListProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const [viewTodoId, setViewTodoId] = useState<string | null>(null);
  const deleteConfirm = useDeleteConfirm<string>();

  const { todos, isLoading, isError, message, selectedTodo, filterProjectId } = useSelector((state: RootState) => state.todos);
  const { selectedProject } = useSelector((state: RootState) => state.projects);
  const { user } = useSelector((state: RootState) => state.auth);

  const filteredTodos = useMemo(() => {
    if (!filterProjectId) return todos;
    return todos?.filter((todo) => {
      const pId = typeof todo.project === 'object' ? todo.project?._id : todo.project;
      return pId === filterProjectId;
    });
  }, [todos, filterProjectId]);

  const byPriority = useMemo(() => groupByPriority(filteredTodos), [filteredTodos]);

  const handleEditFromView = (todo: Todo) => {
    setViewTodoId(null);
    onEditTodo?.(todo);
  };

  useEffect(() => {
    if (viewTodoId) {
      dispatch(getComments(viewTodoId));
      dispatch(getTodoById(viewTodoId));
    }
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
    if (user) dispatch(getTodos(filterProjectId || undefined));
    if (filterProjectId) {
      dispatch(getProject(filterProjectId));
    } else {
      dispatch(clearSelectedProject());
    }
    return () => { dispatch(reset()); };
  }, [user, dispatch, filterProjectId]);

  const handleDeleteConfirm = () => {
    if (deleteConfirm.target === null) return;
    const id = deleteConfirm.target;
    deleteConfirm.close();
    dispatch(deleteTodo(id))
      .unwrap()
      .then((payload) => {
        toast.success(payload?.message || 'Todo deleted');
        dispatch(getTodos(filterProjectId || undefined))
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
      {selectedProject && (
        <div className="mb-6 flex items-center justify-between bg-indigo-50 border border-indigo-100 rounded-lg px-4 py-3">
          <div className="flex items-center space-x-3">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: selectedProject.color }}
            />
            <span className="text-sm font-medium text-indigo-900">
              Filtering by project: <span className="font-bold">{selectedProject.name}</span>
            </span>
          </div>
          <button
            onClick={() => dispatch(setFilterProjectId(null))}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 uppercase tracking-wider"
          >
            Clear Filter
          </button>
        </div>
      )}
      {filteredTodos.length === 0 ? (
        <EmptyState
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
          title={filterProjectId ? "No todos found for this project" : "No todos found"}
          subtitle={filterProjectId ? "Try clearing the filter or adding a new task!" : "Add your first todo to get started!"}
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
        {!selectedTodo ? (
          <div className="flex justify-center py-10">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="space-y-6">
            <TodoDetailView
              todo={selectedTodo}
              onUpdate={(todoData) => dispatch(updateTodo({ id: selectedTodo._id, todoData }))}
              onDelete={() => deleteConfirm.requestDelete(selectedTodo._id)}
              onEdit={onEditTodo ? () => handleEditFromView(selectedTodo) : undefined}
              isOwner={
                typeof selectedTodo.user === 'object'
                  ? selectedTodo.user._id === user?._id
                  : selectedTodo.user === user?._id
              }
            />
            <CommentSection todoId={selectedTodo._id} />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TodoList;

