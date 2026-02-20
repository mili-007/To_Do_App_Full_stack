import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getProjects } from '../features/projects/projectSlice';
import type { AppDispatch } from '../app/store';
import { getCategories } from '../features/categories/categorySlice';
import type { Todo } from '../types';
import TodoForm from '../components/todos/TodoForm';
import TodoList from '../components/todos/TodoList';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [addEditModalOpen, setAddEditModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  useEffect(() => {
    dispatch(getProjects());
    dispatch(getCategories());
  }, [dispatch]);

  const openAddModal = () => {
    setEditingTodo(null);
    setAddEditModalOpen(true);
  };

  const openEditModal = (todo: Todo) => {
    setEditingTodo(todo);
    setAddEditModalOpen(true);
  };

  const closeAddEditModal = () => {
    setAddEditModalOpen(false);
    setEditingTodo(null);
  };

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
          onClick={openAddModal}
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
        open={addEditModalOpen}
        onClose={closeAddEditModal}
        title={editingTodo ? 'Edit Todo' : 'Add Todo'}
      >
        <TodoForm
          embedded
          initialTodo={editingTodo}
          onCancel={closeAddEditModal}
          onSuccess={closeAddEditModal}
        />
      </Modal>

      <TodoList onEditTodo={openEditModal} />
    </div>
  );
};

export default Dashboard;
