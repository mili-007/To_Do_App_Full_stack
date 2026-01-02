import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getTodos, updateTodo, deleteTodo } from '../features/todos/todoSlice';
import { getComments, createComment } from '../features/comments/commentSlice';
import type { AppDispatch, RootState } from '../app/store';
import CommentSection from '../components/comments/CommentSection';
import TodoDetailView from '../components/todos/TodoDetailView';

const TodoDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { todos, isLoading } = useSelector((state: RootState) => state.todos);
  const { user } = useSelector((state: RootState) => state.auth);

  const todo = todos.find(t => t._id === id);

  useEffect(() => {
    if (!todo && !isLoading) {
      dispatch(getTodos());
    }
    if (id) {
      dispatch(getComments(id));
    }
  }, [id, todo, isLoading, dispatch]);

  if (isLoading && !todo) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
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

  const handleUpdate = (todoData: any) => {
    dispatch(updateTodo({ id: todo._id, todoData }));
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      dispatch(deleteTodo(todo._id));
      navigate('/dashboard');
    }
  };

  const handleComment = (content: string) => {
    dispatch(createComment({ todoId: todo._id, content }));
  };

  return (
    <div>
      <div className="mb-6">
        <Link 
          to="/dashboard" 
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium mb-4"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Todos
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Todo Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <TodoDetailView 
            todo={todo} 
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            isOwner={typeof todo.user === 'object' ? todo.user._id === user?._id : todo.user === user?._id}
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
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  todo.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
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

