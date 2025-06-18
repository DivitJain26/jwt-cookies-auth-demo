import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

import { useAuth } from '../context/AuthContext';

//-------------------------Schema----------------------------
export const registerSchema = z
    .object({
        name: z.string().min(1, 'Name is required'),
        email: z.string().email('Invalid email address'),
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .regex(/[a-z]/, { message: 'Must include a lowercase letter' })
            .regex(/[A-Z]/, { message: 'Must include an uppercase letter' })
            .regex(/\d/, { message: 'Must include a number' })
            .regex(/[^A-Za-z0-9]/, { message: 'Must include a special character' }),
        confirmPassword: z.string().min(1, 'Confirm your password'),
        role: z.enum(['patient', 'doctor'], { required_error: 'Role is required' })
    }).refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Passwords do not match',
    })

//--------------------------Type----------------------------
type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();
    const { state, register } = useAuth();
    const { isLoading, isAuthenticated } = state;

    const {
        register: formRegister,
        handleSubmit,
        formState: { errors },
        setError,
        clearErrors
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: 'patient'
        }
    });

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const onSubmit = async (data: RegisterFormData) => {
        clearErrors();
        try {
            await register(data.name, data.email, data.password, data.confirmPassword, data.role);
        } catch (error: unknown) {
            // console.log(`Registration failed`, error);

            setError('root', {
                type: 'manual',
                message: error instanceof Error
                    ? error.message || 'Registraion failed. Please try again.'
                    : 'An unknown error occurred.',
            });
        }
    };

    return (
        <div className="min-h-screen flex gap-1 items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Register to Your Account</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                            Login here
                        </Link>
                    </p>
                </div>

                {errors.root && (
                    <p className="mt-0 text-sm text-red-600 text-center">{errors.root.message}</p>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="rounded-md space-y-px">
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name
                            </label>
                            <input
                                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${errors.name ? 'border-red-300' : 'border-gray-600'
                                    } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                id="name"
                                type="text"
                                placeholder="Full Name"
                                {...formRegister('name')}
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-600'
                                    } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                id="email"
                                type="email"
                                placeholder="Email"
                                {...formRegister('email')}
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
                                    className={`appearance-none rounded-md relative block w-full px-3 py-2 pr-10 border ${errors.password ? 'border-red-300' : 'border-gray-600'
                                        } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    {...formRegister('password')}
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

                        <div className="mb-4 relative">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    className={`appearance-none rounded-md relative block w-full px-3 py-2 pr-10 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-600'
                                        } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Confirm Password"
                                    {...formRegister('confirmPassword')}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(prev => !prev)}
                                    className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                                >
                                    {showConfirmPassword ? (
                                        <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5" aria-hidden="true" />
                                    )}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                            )}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                                Role
                            </label>
                            <select
                                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${errors.role ? 'border-red-300' : 'border-gray-600'
                                    } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                id="role"
                                {...formRegister('role')}
                            >
                                <option value="patient">Patient</option>
                                <option value="doctor">Doctor</option>
                            </select>
                            {errors.role && (
                                <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            {isLoading ? 'Registering...' : 'Register'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

}

export default Register;