import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AppRoutes from './routes';
import ToastContainer from './components/ui/ToastContainer';
import { logout } from './features/auth/authSlice';
import { setUnauthorizedHandler } from './config/unauthorizedHandler';
import type { AppDispatch } from './app/store';

const App = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    setUnauthorizedHandler(() => {
      dispatch(logout());
    });
    return () => setUnauthorizedHandler(null);
  }, [dispatch]);

  return (
    <>
      <AppRoutes />
      <ToastContainer />
    </>
  );
};

export default App;
