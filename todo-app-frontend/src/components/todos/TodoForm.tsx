import { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent,} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTodo } from '../../features/todos/todoSlice';
import { getProjects } from '../../features/projects/projectSlice';
import { getCategories } from '../../features/categories/categorySlice';
import type { AppDispatch, RootState } from '../../app/store';
import type { TodoFormData } from '../../types';
import Input from '../ui/Input';
import Button from '../ui/Button';

/** Today in local date for min attribute (YYYY-MM-DD). User cannot pick a past due date. */
const getTodayMinDate = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

type FormErrors = Partial<Record<'title' | 'dueDate', string>>;

interface TodoFormProps {
  onCancel?: () => void;
  onSuccess?: () => void;
  /** When true, omit card wrapper and heading (e.g. inside a modal) */
  embedded?: boolean;
}

const TodoForm = ({ onCancel, onSuccess, embedded = false }: TodoFormProps) => {
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

    dispatch(createTodo(todoData))
      .unwrap()
      .then(() => {
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
        onSuccess?.();
      })
      .catch(() => {
        // Error handled by slice / ErrorBanner elsewhere
      });
  };
  
  const formContent = (
    <>
      {createError && createMessage && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm" role="alert">
          {createMessage}
        </div>
      )}
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <Input
          type="text"
          name="title"
          id="title"
          label="Title"
          value={title}
          onChange={onChange}
          placeholder="Enter todo title"
          required
          error={errors.title}
        />

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
            <Input
              type="date"
              name="dueDate"
              id="dueDate"
              label="Due Date"
              value={dueDate}
              min={getTodayMinDate()}
              onChange={onChange}
              error={errors.dueDate}
            />
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
               <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="project">
                  Categories (Optional)
                </label>
                <select
                  className="input-field"
                  id="project"
                  name="project"
                  value={project || ''}
                  onChange={() => handleCategoryToggle()}
                >
                  <option value="">No Categories</option>
                  {availableCategories?.map((proj) => (
                    <option key={proj._id} value={proj._id}>
                      {proj.name}
                    </option>
                  ))}
                </select>
                  </div>
                </div>
              )}
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            type="submit"
            variant="primaryLift"
            fullWidth
            className={onCancel ? 'sm:flex-1' : ''}
          >
            <span className="flex items-center justify-center space-x-2">
              <span>Add Todo</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </span>
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              className="sm:flex-1"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </>
  );

  if (embedded) {
    return formContent;
  }

  return (
    <div className="card bg-white/90 backdrop-blur-sm border border-gray-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Add New Todo</h2>
        <p className="text-sm text-gray-500">Create a new task to stay organized</p>
      </div>
      {formContent}
    </div>
  );
};

export default TodoForm;

