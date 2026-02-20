import { useState, FormEvent, ChangeEvent } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface CategoryFormProps {
  onSubmit: (categoryData: { name: string; color?: string }) => void;
  isLoading: boolean;
}

const CategoryForm = ({ onSubmit, isLoading }: CategoryFormProps) => {
  const [formData, setFormData] = useState({ name: '', color: '#10B981' });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      setError('Category name is required');
      return;
    }
    setError(null);
    onSubmit({ ...formData, name: trimmedName });
    setFormData({ name: '', color: '#10B981' });
  };

  return (
    <div className="card bg-white/90 backdrop-blur-sm border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Create New Category</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          name="name"
          label="Category Name"
          value={formData.name}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setFormData(prev => ({ ...prev, name: e.target.value }));
            if (error) setError(null);
          }}
          placeholder="Enter category name"
          required
          error={error ?? undefined}
        />
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Color
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={formData.color}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, color: e.target.value }))}
              className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
            />
            <div
              className="flex-1 h-12 rounded-lg border border-gray-300 flex items-center justify-center text-white font-medium"
              style={{ backgroundColor: formData.color }}
            >
              Preview
            </div>
          </div>
        </div>
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

