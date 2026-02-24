import { useForm, Controller } from 'react-hook-form';
import type { ProjectFormProps, ProjectFormValues } from '../../types';
import Input from '../ui/Input';
import Button from '../ui/Button';

const defaultValues: ProjectFormValues = {
  name: '',
  description: '',
  color: '#3B82F6'
};

const ProjectForm = ({ onSubmit, isLoading, embedded = false }: ProjectFormProps) => {
  const {
    control,
    handleSubmit,
    reset
  } = useForm<ProjectFormValues>({ defaultValues });

  const onFormSubmit = (data: ProjectFormValues) => {
    onSubmit({ name: data.name, description: data.description || undefined, color: data.color });
    reset(defaultValues);
  };

  const form = (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <Controller
          name="name"
          control={control}
          rules={{ required: 'Project name is required' }}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              type="text"
              label="Project Name"
              placeholder="Enter project name"
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
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Description
              </label>
              <textarea
                {...field}
                value={field.value ?? ''}
                className="input-field resize-none"
                placeholder="Enter project description (optional)"
                rows={3}
              />
            </div>
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
          Create Project
        </Button>
      </form>
  );

  if (embedded) {
    return form;
  }

  return (
    <div className="card bg-white/90 backdrop-blur-sm border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Create New Project</h2>
      {form}
    </div>
  );
};

export default ProjectForm;
