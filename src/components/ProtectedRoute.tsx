import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

interface Props { children: React.ReactNode; }

export default function ProtectedRoute({ children }: Props) {
  const { user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}