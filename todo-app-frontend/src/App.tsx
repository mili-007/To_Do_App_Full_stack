import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import LoginPage from './pages/LoginPage';
import Register from './components/auth/Register';
import Dashboard from './pages/Dashboard';
import ProjectsPage from './pages/ProjectsPage';
import CategoriesPage from './pages/CategoriesPage';
import TodoDetailPage from './pages/TodoDetailPage';
import Layout from './components/layout/Layout';
import PrivateRoute from './components/auth/PrivateRoute';
import { logout } from './features/auth/authSlice';
import type { RootState, AppDispatch } from './app/store';

// Inner component that can use useNavigate hook
const AppRoutes = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  // Listen for auth logout events from axios interceptor
  useEffect(() => {
    const handleAuthLogout = () => {
      dispatch(logout());
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        navigate('/login');
      }
    };
    
    window.addEventListener('auth:logout', handleAuthLogout);
    
    return () => {
      window.removeEventListener('auth:logout', handleAuthLogout);
    };
  }, [dispatch, navigate]);
  
  return (
    <Routes>
      <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<Register />} />
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/projects" 
        element={
          <PrivateRoute>
            <Layout>
              <ProjectsPage />
            </Layout>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/categories" 
        element={
          <PrivateRoute>
            <Layout>
              <CategoriesPage />
            </Layout>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/todos/:id" 
        element={
          <PrivateRoute>
            <Layout>
              <TodoDetailPage />
            </Layout>
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

const App = () => {
  return <AppRoutes />;
};

export default App;

