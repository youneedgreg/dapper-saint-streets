import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingScreen from '@/components/LoadingScreen';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  requireAuth = true, 
  requireAdmin = false 
}: ProtectedRouteProps) => {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        navigate('/login', { state: { from: window.location.pathname } });
      } else if (requireAdmin && !isAdmin) {
        navigate('/');
      }
    }
  }, [user, loading, isAdmin, requireAuth, requireAdmin, navigate]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (requireAuth && !user) {
    return null;
  }

  if (requireAdmin && !isAdmin) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
