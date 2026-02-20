import { useEffect } from 'react';
import { toast } from '../utils/toast';
import { useDispatch, useSelector } from 'react-redux';
import { getProjects, createProject, deleteProject } from '../features/projects/projectSlice';
import type { AppDispatch, RootState } from '../app/store';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import FormListLayout from '../components/ui/FormListLayout';
import ProjectForm from '../components/projects/ProjectForm';
import ProjectList from '../components/projects/ProjectList';
import { useDeleteConfirm } from '../hooks/useDeleteConfirm';

const ProjectsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { projects, isLoading, isError, message } = useSelector((state: RootState) => state.projects);
  const deleteConfirm = useDeleteConfirm<string>();

  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

  const handleCreateProject = (projectData: { name: string; description?: string; color?: string }) => {
    dispatch(createProject(projectData));
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirm.target === null) return;
    const id = deleteConfirm.target;
    deleteConfirm.close();
    dispatch(deleteProject(id))
      .unwrap()
      .then(() => toast.success('Project removed'))
      .catch((err: string) => toast.error(err || 'Failed to delete project'));
  };

  return (
    <div>
      <ConfirmDialog
        open={deleteConfirm.isOpen}
        title="Delete project"
        message="Are you sure? This will remove the project from all todos."
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={deleteConfirm.close}
      />
      <FormListLayout
        title="Projects"
        subtitle="Organize your todos into projects"
        errorMessage={message ?? ''}
        showError={!!isError && !!message}
        formContent={<ProjectForm onSubmit={handleCreateProject} isLoading={isLoading} />}
        listContent={
          <ProjectList
            projects={projects}
            isLoading={isLoading}
            onDelete={deleteConfirm.requestDelete}
          />
        }
      />
    </div>
  );
};

export default ProjectsPage;
