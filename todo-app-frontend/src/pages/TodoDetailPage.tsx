import { useEffect } from 'react';
import { toast } from '../utils/toast';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type { AppDispatch, RootState } from '../app/store';
import CommentSection from '../components/comments/CommentSection';
import TodoDetailView from '../components/todos/TodoDetailView';
import BackLink from '../components/ui/BackLink';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import PageHeader from '../components/ui/PageHeader';
import { getComments } from '../features/comments/commentSlice';
import { deleteTodo, getTodos, updateTodo } from '../features/todos/todoSlice';
import { useDeleteConfirm } from '../hooks/useDeleteConfirm';

const TodoDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { todos, isLoading } = useSelector((state: RootState) => state.todos);
  const { user } = useSelector((state: RootState) => state.auth);
  const deleteConfirm = useDeleteConfirm<string>();

  const todo = todos.find(t => t._id === id);

  useEffect(() => {
    if (!todo && !isLoading) dispatch(getTodos());
    if (id) dispatch(getComments(id));
  }, [id, todo, isLoading, dispatch]);

  if (isLoading && !todo) {
    return <LoadingSpinner />;
  }

  if (!todo) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Todo not found</h2>
        <Link to="/dashboard" className="text-indigo-600 hover:text-indigo-800 font-medium">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  const handleUpdate = (todoData: Record<string, unknown>) => {
    dispatch(updateTodo({ id: todo._id, todoData }));
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirm.target === null) return;
    deleteConfirm.close();
    dispatch(deleteTodo(deleteConfirm.target))
      .unwrap()
      .then(() => {
        toast.success('Todo deleted');
        navigate('/dashboard');
      })
      .catch((err: string) => toast.error(err || 'Failed to delete todo'));
  };

  const isOwner =
    typeof todo.user === 'object' ? todo.user._id === user?._id : todo.user === user?._id;

  return (
    <div>
      <ConfirmDialog
        open={deleteConfirm.isOpen}
        title="Delete todo"
        message="Are you sure you want to delete this todo?"
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={deleteConfirm.close}
      />
      <div className="mb-6">
        <BackLink to="/dashboard">Back to Todos</BackLink>
        <PageHeader title="Todo Details" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <TodoDetailView
            todo={todo}
            onUpdate={handleUpdate}
            onDelete={() => deleteConfirm.requestDelete(todo._id)}
            isOwner={isOwner}
          />
          <div className="mt-6">
            <CommentSection todoId={todo._id} />
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="card bg-white/90 backdrop-blur-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Info</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Status:</span>
                <span
                  className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    todo.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {todo.completed ? 'Completed' : 'Pending'}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-600">Created:</span>
                <span className="ml-2 text-sm text-gray-800">
                  {new Date(todo.createdAt).toLocaleDateString()}
                </span>
              </div>
              {todo.updatedAt && (
                <div>
                  <span className="text-sm text-gray-600">Updated:</span>
                  <span className="ml-2 text-sm text-gray-800">
                    {new Date(todo.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoDetailPage;
