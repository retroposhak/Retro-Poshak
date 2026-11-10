import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-ink-mute text-sm font-cond tracking-wide2 uppercase">
          Checking permissions…
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login?redirect=/admin" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return children;
}