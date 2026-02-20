import { useForm, Controller } from 'react-hook-form';
import type { CategoryFormProps, CategoryFormValues } from '../../types';
import Input from '../ui/Input';
import Button from '../ui/Button';

const defaultValues: CategoryFormValues = {
  name: '',
  color: '#10B981'
};

const CategoryForm = ({ onSubmit, isLoading }: CategoryFormProps) => {
  const {
    control,
    handleSubmit,
    reset
  } = useForm<CategoryFormValues>({ defaultValues });

  const onFormSubmit = (data: CategoryFormValues) => {
    const trimmedName = data.name.trim();
    onSubmit({ name: trimmedName, color: data.color });
    reset(defaultValues);
  };

  return (
    <div className="card bg-white/90 backdrop-blur-sm border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Create New Category</h2>
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <Controller
          name="name"
          control={control}
          rules={{ required: 'Category name is required' }}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              type="text"
              label="Category Name"
              placeholder="Enter category name"
              required
              error={fieldState.error?.message}
            />
          )}
        />
        <Controller
          name="color"
          control={control}
          render={({ field }) => (
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  {...field}
                  className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
                />
                <div
                  className="flex-1 h-12 rounded-lg border border-gray-300 flex items-center justify-center text-white font-medium"
                  style={{ backgroundColor: field.value }}
                >
                  Preview
                </div>
              </div>
            </div>
          )}
        />
        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={isLoading}
          loadingLabel="Creating..."
        >
          Create Category
        </Button>
      </form>
    </div>
  );
};

export default CategoryForm;
