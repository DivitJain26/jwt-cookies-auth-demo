import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';


const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string()
        .trim()
        .min(8, { message: "Password must be at least 8 characters" })
        .regex(/[a-z]/, { message: "Must include a lowercase letter" })
        .regex(/[A-Za-z]/, { message: "Must include at least one alphabet character" })
        .regex(/[^A-Za-z0-9]/, { message: "Must include a special character" }),
});

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/dashboard';

    const { state, login } = useAuth();
    const { isLoading, isAuthenticated } = state;

    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
    });

    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, from]);

    const onSubmit = async (data) => {
        clearErrors();
        try {
            await login(data.email, data.password);

        } catch (error) {
            // Assuming `err.message` has the backend error message
            setError('root', {
                type: 'manual',
                message: error.message || 'Login failed. Please try again.',
            });
        }
    };

    return (
        <div className="min-h-screen flex gap-1 items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md">

                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Log in to your account</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Or{' '}
                        <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                            create a new account
                        </Link>
                    </p>
                </div>

                {errors.root && (
                    <p className="mt-0 text-sm text-red-600 text-center">{errors.root.message}</p>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email address
                            </label>
                            <input
                                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'
                                    } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                id="email"
                                type="email"
                                autoComplete="email"
                                {...register('email')}
                                placeholder="Email address"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="mb-4 relative">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    className={`appearance-none rounded-md relative block w-full px-3 py-2 pr-10 border ${errors.password ? 'border-red-300' : 'border-gray-300'
                                        } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    {...register('password')}
                                    placeholder="Password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(prev => !prev)}
                                    className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                                >
                                    {showPassword ? (
                                        <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5" aria-hidden="true" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
