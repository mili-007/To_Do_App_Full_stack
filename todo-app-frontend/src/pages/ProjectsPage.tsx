import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProjects, createProject, deleteProject } from '../features/projects/projectSlice';
import type { AppDispatch, RootState } from '../app/store';
import ProjectForm from '../components/projects/ProjectForm';
import ProjectList from '../components/projects/ProjectList';

const ProjectsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { projects, isLoading, isError, message } = useSelector((state: RootState) => state.projects);

  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

  const handleCreateProject = (projectData: { name: string; description?: string; color?: string }) => {
    dispatch(createProject(projectData));
  };

  const handleDeleteProject = (id: string) => {
    if (window.confirm('Are you sure? This will remove the project from all todos.')) {
      dispatch(deleteProject(id));
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Projects</h1>
        <p className="text-gray-600">Organize your todos into projects</p>
      </div>

      {isError && message && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <ProjectForm onSubmit={handleCreateProject} isLoading={isLoading} />
        </div>
        <div className="lg:col-span-2">
          <ProjectList 
            projects={projects} 
            isLoading={isLoading}
            onDelete={handleDeleteProject}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;

