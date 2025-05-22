import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// This component checks if the user is authenticated. If not, it redirects to the login page.
const ProtectedRoute = ({ children }) => {
  const { state } = useAuth();
  const { user } = state;

  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;