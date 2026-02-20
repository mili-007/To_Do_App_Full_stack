import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getProjects } from '../features/projects/projectSlice';
import { getCategories } from '../features/categories/categorySlice';
import TodoForm from '../components/todos/TodoForm';
import TodoList from '../components/todos/TodoList';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import type { AppDispatch } from '../app/store';

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [addTodoModalOpen, setAddTodoModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getProjects());
    dispatch(getCategories());
  }, [dispatch]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="min-w-0">
          <PageHeader
            title="My Todos"
            subtitle="Manage your tasks and stay organized"
          />
        </div>
        <Button
          type="button"
          variant="primaryLift"
          onClick={() => setAddTodoModalOpen(true)}
          className="shrink-0"
        >
          <span className="flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Todo</span>
          </span>
        </Button>
      </div>

      <Modal
        open={addTodoModalOpen}
        onClose={() => setAddTodoModalOpen(false)}
        title="Add Todo"
      >
        <TodoForm
          embedded
          onCancel={() => setAddTodoModalOpen(false)}
          onSuccess={() => setAddTodoModalOpen(false)}
        />
      </Modal>

      <TodoList />
    </div>
  );
};

export default Dashboard;
