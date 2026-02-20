import { useEffect } from 'react';
import { toast } from '../utils/toast';
import { getCategories, createCategory, deleteCategory } from '../features/categories/categorySlice';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../app/store';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import FormListLayout from '../components/ui/FormListLayout';
import CategoryForm from '../components/categories/CategoryForm';
import CategoryList from '../components/categories/CategoryList';
import { useDeleteConfirm } from '../hooks/useDeleteConfirm';

const CategoriesPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, isLoading, isError, message } = useSelector((state: RootState) => state.categories);
  const deleteConfirm = useDeleteConfirm<string>();

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const handleCreateCategory = (categoryData: { name: string; color?: string }) => {
    dispatch(createCategory(categoryData));
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirm.target === null) return;
    const id = deleteConfirm.target;
    deleteConfirm.close();
    dispatch(deleteCategory(id))
      .unwrap()
      .then(() => toast.success('Category removed'))
      .catch((err: string) => toast.error(err || 'Failed to delete category'));
  };

  return (
    <div>
      <ConfirmDialog
        open={deleteConfirm.isOpen}
        title="Delete category"
        message="Are you sure? This will remove the category from all todos."
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={deleteConfirm.close}
      />
      <FormListLayout
        title="Categories"
        subtitle="Create and manage categories to tag your todos"
        errorMessage={message ?? ''}
        showError={!!isError && !!message}
        formContent={<CategoryForm onSubmit={handleCreateCategory} isLoading={isLoading} />}
        listContent={
          <CategoryList
            categories={categories}
            isLoading={isLoading}
            onDelete={deleteConfirm.requestDelete}
          />
        }
      />
    </div>
  );
};

export default CategoriesPage;
