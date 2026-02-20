import { useEffect } from 'react';
import { toast } from '../utils/toast';
import { getProjects, deleteProject } from '../features/projects/projectSlice';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../app/store';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import ErrorBanner from '../components/ui/ErrorBanner';
import PageHeader from '../components/ui/PageHeader';
import ProjectList from '../components/projects/ProjectList';
import { useDeleteConfirm } from '../hooks/useDeleteConfirm';

const ProjectsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { projects, isLoading, isError, message } = useSelector((state: RootState) => state.projects);
  const deleteConfirm = useDeleteConfirm<string>();

  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

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
    <div className="max-w-6xl mx-auto">
      <PageHeader title="Projects" subtitle="Organize your todos into projects" />
      <ErrorBanner message={message ?? ''} show={!!isError && !!message} />
      <button>Add Project</button>
      <ConfirmDialog
        open={deleteConfirm.isOpen}
        title="Delete project"
        message="Are you sure? This will remove the project from all todos."
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={deleteConfirm.close}
      />
      <ProjectList
        projects={projects}
        isLoading={isLoading}
        onDelete={deleteConfirm.requestDelete}
      />
    </div>
  );
};

export default ProjectsPage;
