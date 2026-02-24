import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setFilterProjectId } from '../../features/todos/todoSlice';
import type { AppDispatch } from '../../app/store';
import type { Project } from '../../types';
import LoadingSpinner from '../ui/LoadingSpinner';
import EmptyState from '../ui/EmptyState';

interface ProjectListProps {
  projects: Project[];
  isLoading: boolean;
  onDelete: (id: string) => void;
}

const ProjectList = ({ projects, isLoading, onDelete }: ProjectListProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleViewTodos = (id: string) => {
    dispatch(setFilterProjectId(id));
    navigate('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="card">
        <LoadingSpinner />
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <EmptyState
        icon={
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        }
        title="No projects yet"
        subtitle="Create your first project to get started!"
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="card bg-white/90 backdrop-blur-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Projects ({projects.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects?.map((project) => (
            <div
              key={project._id}
              className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all duration-200 bg-white"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3 flex-1">
                  <div
                    className="w-5 h-5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: project.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                      {project.name}
                    </h3>
                    {project.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {project.description}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => onDelete(project._id)}
                  className="text-red-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors"
                  title="Delete project"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <span className="text-xs text-gray-500">
                  Created {new Date(project.createdAt).toLocaleDateString()}
                </span>
                <button
                  onClick={() => handleViewTodos(project._id)}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  View Todos →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectList;

