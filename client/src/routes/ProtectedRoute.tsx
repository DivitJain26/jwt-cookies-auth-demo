import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ReactNode } from 'react';

// This component checks if the user is authenticated. If not, it redirects to the login page.
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const { state } = useAuth();
    const { isAuthenticated } = state;

    return isAuthenticated ? children : <Navigate to="/login" replace/>;
};

export default ProtectedRoute;