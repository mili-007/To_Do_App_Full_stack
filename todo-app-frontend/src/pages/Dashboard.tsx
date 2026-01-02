import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getProjects } from '../features/projects/projectSlice';
import { getCategories } from '../features/categories/categorySlice';
import TodoForm from '../components/todos/TodoForm';
import TodoList from '../components/todos/TodoList';
import type {  AppDispatch } from '../app/store';

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  useEffect(() => {
    // Load projects and categories for the form
    dispatch(getProjects());
    dispatch(getCategories());
  }, [dispatch]);
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Todos</h1>
        <p className="text-gray-600">Manage your tasks and stay organized</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <TodoForm />
        </div>
        <div className="lg:col-span-2">
          <TodoList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

