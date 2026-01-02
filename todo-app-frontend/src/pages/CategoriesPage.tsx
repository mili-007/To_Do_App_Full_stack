import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCategories, createCategory, deleteCategory } from '../features/categories/categorySlice';
import type { AppDispatch, RootState } from '../app/store';
import CategoryForm from '../components/categories/CategoryForm';
import CategoryList from '../components/categories/CategoryList';

const CategoriesPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, isLoading, isError, message } = useSelector((state: RootState) => state.categories);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const handleCreateCategory = (categoryData: { name: string; color?: string }) => {
    dispatch(createCategory(categoryData));
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm('Are you sure? This will remove the category from all todos.')) {
      dispatch(deleteCategory(id));
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Categories</h1>
        <p className="text-gray-600">Create and manage categories to tag your todos</p>
      </div>

      {isError && message && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <CategoryForm onSubmit={handleCreateCategory} isLoading={isLoading} />
        </div>
        <div className="lg:col-span-2">
          <CategoryList 
            categories={categories} 
            isLoading={isLoading}
            onDelete={handleDeleteCategory}
          />
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;

