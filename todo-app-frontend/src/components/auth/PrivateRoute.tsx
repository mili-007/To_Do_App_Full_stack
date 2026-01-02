import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  
  return user ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRoute;
