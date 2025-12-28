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
    console.log('[ProtectedRoute] effect', { loading, hasUser: !!user, isAdmin, requireAuth, requireAdmin })
    if (!loading) {
      if (requireAuth && !user) {
        console.warn('[ProtectedRoute] redirect -> /login')
        navigate('/login', { state: { from: window.location.pathname } });
      } else if (requireAdmin && !isAdmin) {
        console.warn('[ProtectedRoute] redirect -> / (not admin)')
        navigate('/');
      } else {
        console.log('[ProtectedRoute] access granted')
      }
    }
  }, [user, loading, isAdmin, requireAuth, requireAdmin, navigate]);

  if (loading) {
    console.log('[ProtectedRoute] render -> LoadingScreen (loading=true)')
    return <LoadingScreen />;
  }

  if (requireAuth && !user) {
    console.log('[ProtectedRoute] render -> null (no user)')
    return null;
  }

  if (requireAdmin && !isAdmin) {
    console.log('[ProtectedRoute] render -> null (not admin)')
    return null;
  }

  console.log('[ProtectedRoute] render -> children')
  return <>{children}</>;
};

export default ProtectedRoute;
