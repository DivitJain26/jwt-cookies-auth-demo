import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import api from '../utils/axios.ts';

//------------------Types--------------------
interface User {
    _id: string,
    name: string,
    email: string,
    role: string,
}

interface AuthState {
    user: User | null,
    isAuthenticated: boolean,
    isLoading: boolean,
    error: string | null,
}

interface AuthContextType {
    state: AuthState,
    login: (email: string, password: string) => Promise<void>,
    register: (name: string, email: string, password: string, role: string) => Promise<void>,
    logout: () => Promise<void>,
    clearError: () => void,
}

//-----------------------Initial state-----------------------------
const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
};

//-------------------- Context Creation --------------------
const AuthContext = createContext<AuthContextType>({
    state: initialState,
    login: async () => { },
    register: async () => { },
    logout: async () => { },
    clearError: () => { },
});

// -------------------- Provider --------------------
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await api.post(
                '/auth/login',
                { email, password },
            );
            setUser(res.data.user);
            setIsAuthenticated(true);

        } catch (err: any) {
            console.log(`Login failed ${err}`);
            setIsAuthenticated(false);
            setUser(null);
            throw new Error(err.response?.data?.error || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (name: string, email: string, password: string, role: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await api.post(
                '/auth/register',
                { name, email, password, role }
            );
            setUser(res.data.user);
            setIsAuthenticated(true);
        } catch (err: any) {
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
        } catch (err: any) {
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
