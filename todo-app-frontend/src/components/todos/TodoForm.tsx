import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTodo } from '../../features/todos/todoSlice';
import { getProjects } from '../../features/projects/projectSlice';
import { getCategories } from '../../features/categories/categorySlice';
import type { AppDispatch, RootState } from '../../app/store';
import type { TodoFormData } from '../../types';

/** Today in local date for min attribute (YYYY-MM-DD). User cannot pick a past due date. */
const getTodayMinDate = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

type FormErrors = Partial<Record<'title' | 'dueDate', string>>;

const TodoForm = () => {
  const [formData, setFormData] = useState<TodoFormData>({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    project: null,
    categories: [],
    sharedWith: []
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const { title, description, priority, dueDate, project, categories } = formData;
  
  const dispatch = useDispatch<AppDispatch>();
  const { projects } = useSelector((state: RootState) => state.projects);
  const { categories: availableCategories } = useSelector((state: RootState) => state.categories);
  const { isError: createError, message: createMessage } = useSelector((state: RootState) => state.todos);
  
  useEffect(() => {
    dispatch(getProjects());
    dispatch(getCategories());
  }, [dispatch]);
  
  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    setFormData((prevState) => ({
      ...prevState,
      categories: prevState.categories?.includes(categoryId)
        ? prevState.categories.filter(id => id !== categoryId)
        : [...(prevState.categories || []), categoryId]
    }));
  };
  
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: FormErrors = {};

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      newErrors.title = 'Title is required';
    }
    if (dueDate && dueDate < getTodayMinDate()) {
      newErrors.dueDate = 'Due date cannot be in the past. Please select today or a future date.';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const todoData: TodoFormData = {
      title: trimmedTitle,
      description,
      priority,
      dueDate,
      project: project || null,
      categories: categories ?? [],
      sharedWith: formData.sharedWith ?? []
    };

    dispatch(createTodo(todoData));
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      project: null,
      categories: [],
      sharedWith: []
    });
    setErrors({});
  };
  
  return (
    <div className="card bg-white/90 backdrop-blur-sm border border-gray-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Add New Todo</h2>
        <p className="text-sm text-gray-500">Create a new task to stay organized</p>
      </div>
      {createError && createMessage && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm" role="alert">
          {createMessage}
        </div>
      )}
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="title">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            className={`input-field ${errors.title ? 'border-red-500 focus:ring-red-500' : ''}`}
            id="title"
            type="text"
            name="title"
            value={title}
            onChange={onChange}
            placeholder="Enter todo title"
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? 'title-error' : undefined}
          />
          {errors.title && (
            <p id="title-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.title}
            </p>
          )}
        </div>
        
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            className="input-field resize-none"
            id="description"
            name="description"
            value={description}
            onChange={onChange}
            placeholder="Enter todo description (optional)"
            rows={4}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="priority">
              Priority
            </label>
            <select
              className="input-field"
              id="priority"
              name="priority"
              value={priority}
              onChange={onChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="dueDate">
              Due Date
            </label>
            <input
              className={`input-field ${errors.dueDate ? 'border-red-500 focus:ring-red-500' : ''}`}
              id="dueDate"
              type="date"
              name="dueDate"
              value={dueDate}
              min={getTodayMinDate()}
              onChange={onChange}
              title="Select today or a future date"
              aria-invalid={!!errors.dueDate}
              aria-describedby={errors.dueDate ? 'dueDate-error' : undefined}
            />
            {errors.dueDate && (
              <p id="dueDate-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.dueDate}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="project">
            Project (Optional)
          </label>
          <select
            className="input-field"
            id="project"
            name="project"
            value={project || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, project: e.target.value || null }))}
          >
            <option value="">No Project</option>
            {projects.map((proj) => (
              <option key={proj._id} value={proj._id}>
                {proj.name}
              </option>
            ))}
          </select>
        </div>

        {availableCategories.length > 0 && (
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Categories (Optional)
            </label>
            <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg bg-gray-50">
              {availableCategories.map((cat) => (
                <button
                  key={cat._id}
                  type="button"
                  onClick={() => handleCategoryToggle(cat._id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    categories?.includes(cat._id)
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-indigo-400'
                  }`}
                  style={categories?.includes(cat._id) ? { backgroundColor: cat.color } : {}}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <span className="flex items-center justify-center space-x-2">
            <span>Add Todo</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </span>
        </button>
      </form>
    </div>
  );
};

export default TodoForm;

