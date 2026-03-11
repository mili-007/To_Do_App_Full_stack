import { useEffect, useState } from 'react';
import { toast } from '../utils/toast';
import { getCategories, createCategory, deleteCategory } from '../features/categories/categorySlice';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../app/store';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import ErrorBanner from '../components/ui/ErrorBanner';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import CategoryForm from '../components/categories/CategoryForm';
import CategoryList from '../components/categories/CategoryList';
import { useDeleteConfirm } from '../hooks/useDeleteConfirm';

const CategoriesPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, isLoading, isError, message } = useSelector((state: RootState) => state.categories);
  const deleteConfirm = useDeleteConfirm<string>();
  const [addCategoryModalOpen, setAddCategoryModalOpen] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const handleCreateCategory = (categoryData: { name: string; color?: string }) => {
    setIsCreatingCategory(true);
    dispatch(createCategory(categoryData))
      .unwrap()
      .then(() => {
        setAddCategoryModalOpen(false);
        // toast.success('Category created');
      })
      .catch((err: string) => toast.error(err || 'Failed to create category'))
      .finally(() => setIsCreatingCategory(false));
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirm.target === null) return;
    const id = deleteConfirm.target;
    deleteConfirm.close();
    dispatch(deleteCategory(id))
      .unwrap()
      .then(() => {
        // toast.success('Category removed');
        dispatch(getCategories());
      })
      .catch((err: string) => toast.error(err || 'Failed to delete category'));
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="min-w-0">
          <PageHeader
            title="Categories"
            subtitle="Create and manage categories to tag your todos"
          />
        </div>
        <Button
          type="button"
          variant="primaryLift"
          onClick={() => setAddCategoryModalOpen(true)}
          className="shrink-0"
        >
          <span className="flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Category</span>
          </span>
        </Button>
      </div>
      <ErrorBanner message={message ?? ''} show={!!isError && !!message} />
      <ConfirmDialog
        open={deleteConfirm.isOpen}
        title="Delete category"
        message="Are you sure? This will remove the category from all todos."
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={deleteConfirm.close}
      />
      <Modal
        open={addCategoryModalOpen}
        onClose={() => setAddCategoryModalOpen(false)}
        title="Add Category"
      >
        <CategoryForm
          embedded
          isLoading={isCreatingCategory}
          onSubmit={handleCreateCategory}
        />
      </Modal>
      <CategoryList
        categories={categories}
        isLoading={isLoading}
        onDelete={deleteConfirm.requestDelete}
      />
    </div>
  );
};

export default CategoriesPage;
