import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import type { RootState } from '../app/store';
import RegisterPage from '../pages/RegisterPage';
import PrivateRoute from './PrivateRoute';
import AuthRouteLayout from '../components/layout/AuthRouteLayout';
import Layout from '../components/layout/Layout';
import CategoriesPage from '../pages/CategoriesPage';
import Dashboard from '../pages/Dashboard';
import LoginPage from '../pages/LoginPage';
import ProjectsPage from '../pages/ProjectsPage';
import TodoDetailPage from '../pages/TodoDetailPage';
import NotFoundPage from '../pages/NotFoundPage';

const AppRoutes = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <Routes>
      <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
      <Route element={<AuthRouteLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="todos/:id" element={<TodoDetailPage />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
