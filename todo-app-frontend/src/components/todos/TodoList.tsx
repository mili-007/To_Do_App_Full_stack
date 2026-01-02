import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTodos, reset } from '../../features/todos/todoSlice';
import type { RootState, AppDispatch } from '../../app/store';
import TodoItem from './TodoItem';

const TodoList = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  const { todos, isLoading, isError, message } = useSelector(
    (state: RootState) => state.todos
  );
  
  const { user } = useSelector((state: RootState) => state.auth);
  
  useEffect(() => {
    // Handle auth errors (401) gracefully - don't show alert
    // The axios interceptor will handle logout and navigation
    if (isError && message && (
      message.includes('Not authorized') || 
      message.includes('token expired') || 
      message.includes('invalid token') ||
      message.includes('no token')
    )) {
      // Just clear error state - axios interceptor handles logout
      dispatch(reset());
      return;
    }
    
    // Only show alerts for non-auth errors
    if (isError && message) {
      alert(message);
      dispatch(reset());
    }
  }, [isError, message, dispatch]);
  
  useEffect(() => {
    if (user) {
      dispatch(getTodos());
    }
    
    return () => {
      dispatch(reset());
    };
  }, [user, dispatch]);
  
  if (isLoading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Todos</h2>
        <p className="text-sm text-gray-500">
          {todos.length === 0 
            ? 'No tasks yet. Start by adding your first todo!' 
            : `You have ${todos.length} ${todos.length === 1 ? 'task' : 'tasks'}`}
        </p>
      </div>
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
        <div className="space-y-4">
          {todos.map((todo) => (
            <TodoItem key={todo._id} todo={todo} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TodoList;

