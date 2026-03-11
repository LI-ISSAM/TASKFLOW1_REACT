import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';

interface Props { children: React.ReactNode; }

export default function ProtectedRoute({ children }: Props) {
  const { state } = useAuth();
  const location = useLocation();

  if (!state.user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}