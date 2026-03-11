import { useEffect, useState } from 'react';
import { toast } from '../utils/toast';
import { getProjects, createProject, deleteProject } from '../features/projects/projectSlice';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../app/store';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import ErrorBanner from '../components/ui/ErrorBanner';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import ProjectForm from '../components/projects/ProjectForm';
import ProjectList from '../components/projects/ProjectList';
import { useDeleteConfirm } from '../hooks/useDeleteConfirm';

const ProjectsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { projects, isLoading, isError, message } = useSelector((state: RootState) => state.projects);
  const deleteConfirm = useDeleteConfirm<string>();
  const [addProjectModalOpen, setAddProjectModalOpen] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);

  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

  const handleCreateProject = (projectData: { name: string; description?: string; color?: string }) => {
    setIsCreatingProject(true);
    dispatch(createProject(projectData))
      .unwrap()
      .then(() => {
        setAddProjectModalOpen(false);
        // toast.success('Project created');
      })
      .catch((err: string) => toast.error(err || 'Failed to create project'))
      .finally(() => setIsCreatingProject(false));
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirm.target === null) return;
    const id = deleteConfirm.target;
    deleteConfirm.close();
    dispatch(deleteProject(id))
      .unwrap()
      .then(() => {
        // toast.success('Project removed');
        dispatch(getProjects());
      })
      .catch((err: string) => toast.error(err || 'Failed to delete project'));
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="min-w-0">
          <PageHeader title="Projects" subtitle="Organize your todos into projects" />
        </div>
        <Button
          type="button"
          variant="primaryLift"
          onClick={() => setAddProjectModalOpen(true)}
          className="shrink-0"
        >
          <span className="flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Project</span>
          </span>
        </Button>
      </div>
      <ErrorBanner message={message ?? ''} show={!!isError && !!message} />
      <ConfirmDialog
        open={deleteConfirm.isOpen}
        title="Delete project"
        message="Are you sure? This will remove the project from all todos."
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={deleteConfirm.close}
      />
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
      <ProjectList
        projects={projects}
        isLoading={isLoading}
        onDelete={deleteConfirm.requestDelete}
      />
    </div>
  );
};

export default ProjectsPage;
