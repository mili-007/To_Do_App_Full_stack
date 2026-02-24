import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createTodo, updateTodo } from '../../features/todos/todoSlice';
import type { AppDispatch, RootState } from '../../app/store';
import { createProject, getProjects } from '../../features/projects/projectSlice';
import { getCategories } from '../../features/categories/categorySlice';
import type { Todo, TodoFormData, TodoFormProps } from '../../types';
import { getTodayMinDate } from '../../utils/date';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Dropdown from '../ui/Dropdown';
import Modal from '../ui/Modal';
import ProjectForm from '../projects/ProjectForm';
import { PRIORITY_OPTIONS } from '../../constants/todo';

const emptyDefaultValues: TodoFormData = {
  title: '',
  description: '',
  priority: 'medium',
  dueDate: '',
  project: null,
  categories: [],
  // sharedWith: []
};

function todoToFormData(todo: Todo): TodoFormData {
  return {
    title: todo.title,
    description: todo.description ?? '',
    priority: todo.priority,
    dueDate: todo.dueDate ? todo.dueDate.split('T')[0] : '',
    project: typeof todo.project === 'object' ? todo.project?._id ?? null : (todo.project ?? null),
    categories: Array.isArray(todo.categories)
      ? todo.categories.map((c) => (c != null && typeof c === 'object' ? c._id : c)).filter(Boolean) as string[]
      : [],
    // sharedWith: Array.isArray(todo.sharedWith)
    //   ? todo.sharedWith.map((u) => (typeof u === 'object' ? u._id : u)).filter(Boolean)
    //   : []
  };
}

const TodoForm = ({ initialTodo = null, onCancel, onSuccess, embedded = false }: TodoFormProps) => {
  const isEdit = Boolean(initialTodo);
  const defaultValues = isEdit && initialTodo ? todoToFormData(initialTodo) : emptyDefaultValues;

  const { control, handleSubmit, reset, setValue } = useForm<TodoFormData>({ defaultValues });

  const dispatch = useDispatch<AppDispatch>();
  const [addProjectModalOpen, setAddProjectModalOpen] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const { projects } = useSelector((state: RootState) => state.projects);
  const { categories: availableCategories } = useSelector((state: RootState) => state.categories);
  const { isError: createError, message: createMessage } = useSelector((state: RootState) => state.todos);

  useEffect(() => {
    dispatch(getProjects());
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    reset(isEdit && initialTodo ? todoToFormData(initialTodo) : emptyDefaultValues);
  }, [initialTodo?._id, isEdit, reset]);

  const onSubmit = (data: TodoFormData) => {
    const trimmedTitle = data.title.trim();
    const todoData: TodoFormData = {
      title: trimmedTitle,
      description: data.description,
      priority: data.priority,
      dueDate: data.dueDate,
      project: data.project || null,
      categories: data.categories ?? [],
      // sharedWith: data.sharedWith ?? []
    };
    if (isEdit && initialTodo) {
      dispatch(updateTodo({ id: initialTodo._id, todoData }))
        .unwrap()
        .then(() => onSuccess?.())
        .catch(() => {});
    } else {
      dispatch(createTodo(todoData))
        .unwrap()
        .then(() => {
          reset(emptyDefaultValues);
          onSuccess?.();
        })
        .catch(() => {});
    }
  };

  const validateDueDate = (value: string) => {
    if (!value) return true;
    if (value < getTodayMinDate()) {
      return 'Due date cannot be in the past. Please select today or a future date.';
    }
    return true;
  };

  const handleCreateProject = (projectData: { name: string; description?: string; color?: string }) => {
    setIsCreatingProject(true);
    dispatch(createProject(projectData))
      .unwrap()
      .then((project) => {
        setValue('project', project._id);
        setAddProjectModalOpen(false);
      })
      .finally(() => setIsCreatingProject(false));
  };

  const formContent = (
    <>
      {createError && createMessage && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm" role="alert">
          {createMessage}
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <Controller
          name="title"
          control={control}
          rules={{ required: 'Title is required' }}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              id="title"
              label="Title"
              placeholder="Enter todo title"
              required
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="description">
                Description
              </label>
              <textarea
                {...field}
                value={field.value ?? ''}
                className="input-field resize-none"
                id="description"
                placeholder="Enter todo description (optional)"
                rows={4}
              />
            </div>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="priority">
                  Priority
                </label>
                <Dropdown
                  id="priority"
                  options={PRIORITY_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="Select priority"
                  aria-label="Priority"
                />
              </div>
            )}
          />
          <Controller
            name="dueDate"
            control={control}
            rules={{ validate: validateDueDate }}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                type="date"
                id="dueDate"
                label="Due Date"
                min={getTodayMinDate()}
                error={fieldState.error?.message}
              />
            )}
          />
        </div>

        <Controller
          name="project"
          control={control}
          render={({ field }) => (
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <label className="block text-gray-700 text-sm font-semibold" htmlFor="project">
                  Project (Optional)
                </label>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setAddProjectModalOpen(true)}
                  className="shrink-0"
                >
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Project
                  </span>
                </Button>
              </div>
              <Dropdown
                id="project"
                options={[
                  { value: "", label: "No Project" },
                  ...(projects?.map((p) => ({
                    value: p._id,
                    label: p.name
                  })) || [])
                ]}
                value={field.value ?? null}
                onChange={(v) => field.onChange(v || null)}
                onBlur={field.onBlur}
                placeholder="No Project"
                aria-label="Project"
              />
            </div>
          )}
        />

        {availableCategories.length > 0 && (
          <Controller
            name="categories"
            control={control}
            render={({ field }) => (
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="categories">
                  Categories (Optional)
                </label>
                <Dropdown
                  id="categories"
                  options={availableCategories?.map((c) => ({ value: c._id, label: c.name }))}
                  value={field.value ?? []}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  multiSelect
                  placeholder="No categories"
                  aria-label="Categories"
                />
              </div>
            )}
          />
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            type="submit"
            variant="primaryLift"
            fullWidth
            className={onCancel ? 'sm:flex-1' : ''}
          >
            <span className="flex items-center justify-center space-x-2">
              {isEdit ? (
                <span>Update Todo</span>
              ) : (
                <>
                  <span>Add Todo</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </>
              )}
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

      <Modal
        open={addProjectModalOpen}
        onClose={() => setAddProjectModalOpen(false)}
        title="Add Project"
      >
        <ProjectForm
          embedded
          isLoading={isCreatingProject}
          onSubmit={handleCreateProject}
        />
      </Modal>
    </>
  );

  if (embedded) {
    return formContent;
  }

  return (
    <div className="card bg-white/90 backdrop-blur-sm border border-gray-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{isEdit ? 'Edit Todo' : 'Add New Todo'}</h2>
        <p className="text-sm text-gray-500">
          {isEdit ? 'Update your task details' : 'Create a new task to stay organized'}
        </p>
      </div>
      {formContent}
    </div>
  );
};

export default TodoForm;
