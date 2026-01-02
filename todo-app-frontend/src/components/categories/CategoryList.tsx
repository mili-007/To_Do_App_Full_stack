import type { Category } from '../../types';

interface CategoryListProps {
  categories: Category[];
  isLoading: boolean;
  onDelete: (id: string) => void;
}

const CategoryList = ({ categories, isLoading, onDelete }: CategoryListProps) => {
  if (isLoading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="card bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4 mx-auto">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <p className="text-gray-600 font-medium text-lg mb-2">No categories yet</p>
          <p className="text-gray-500 text-sm">Create your first category to tag your todos!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="card bg-white/90 backdrop-blur-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Your Categories ({categories.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div
              key={category._id}
              className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all duration-200 bg-white"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <div
                    className="w-5 h-5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: category.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                      {category.name}
                    </h3>
                    <span className="text-xs text-gray-500">
                      Created {new Date(category.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onDelete(category._id)}
                  className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors ml-2"
                  title="Delete category"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryList;

