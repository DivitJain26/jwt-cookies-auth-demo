import { createContext, useContext, useEffect, useState } from 'react';
import api from '../utils/axios.js';
// import axios from 'axios'; 

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const AuthContext = createContext({
    state: initialState,
    login: async () => { },
    register: async () => { },
    logout: () => { },
    clearError: () => { },
});


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const { data } = await api.get('/auth/me');
                setUser(data.user);
                setIsAuthenticated(true);
            } catch (err) {
                setError(`Session expired ${err}`);
                setIsAuthenticated(false);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        }

        verifyAuth();
    }, []);

    const login = async (email, password) => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await api.post(
                '/auth/login',
                { email, password },
            );
            setUser(res.data.user);
            setIsAuthenticated(true);

        } catch (err) {
            console.log(`Login failed ${err}`);
            setIsAuthenticated(false);
            setUser(null);
            throw new Error(err.response?.data?.error || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (name, email, password, role) => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await api.post(
                '/auth/register',
                { name, email, password, role }
            );
            setUser(res.data.user);
            setIsAuthenticated(true);
        } catch (err) {
            const errorMessage = err.response.status === 402 ? err.response?.data?.error : 'Registration failed';
            setIsAuthenticated(false);
            setUser(null);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await api.post('/auth/logout');
            setUser(null);
            setIsAuthenticated(false);
        } catch (err) {
            console.log(`Logout failed ${err}`);
            setError(err.response?.data?.message || 'Logout failed');
        } finally {
            setIsLoading(false);
        }
    };

    const clearError = () => setError(null);

    const state = {
        user,
        isAuthenticated,
        isLoading,
        error,
    };

    return (
        <AuthContext.Provider
            value={{
                state,
                login,
                register,
                logout,
                clearError
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);
