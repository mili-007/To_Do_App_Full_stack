import { useState, FormEvent, ChangeEvent } from 'react';

interface CategoryFormProps {
  onSubmit: (categoryData: { name: string; color?: string }) => void;
  isLoading: boolean;
}

const CategoryForm = ({ onSubmit, isLoading }: CategoryFormProps) => {
  const [formData, setFormData] = useState({ name: '', color: '#10B981' });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSubmit(formData);
      setFormData({ name: '', color: '#10B981' });
    }
  };

  return (
    <div className="card bg-white/90 backdrop-blur-sm border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Create New Category</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Category Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="input-field"
            placeholder="Enter category name"
            required
          />
        </div>
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
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creating...' : 'Create Category'}
        </button>
      </form>
    </div>
  );
};

export default CategoryForm;

