import { Request } from 'express';

//---------------------------------- Common Types ---------------------------------
// User info returned in successful responses
interface UserResponse {
    id: string;
    name: string;
    email: string;
    role: string;
}

// Error structure with optional user info
export interface ErrorResponse {
    user?: UserResponse;
    error: string;
}

//---------------------------------- Registration Types ---------------------------------
// Data required for user registration
export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    role: string;
}

// Response after successful registration
export interface RegisterResponse {
    success: boolean;
    message: string;
    user: UserResponse;
    error?: string;
}

// ---------------------------------- Login Types ---------------------------------
// Data required for user login
export interface LoginRequest {
    email: string;
    password: string;
}

// Response after successful login
export interface LoginResponse {
    success: boolean;
    message: string;
    user: UserResponse;
    error?: string;
}

// ---------------------------------- Refresh Types ---------------------------------
// Extended request containing optional refreshToken from cookies or body
export interface RefreshTokenRequest extends Request {
    cookies: {
        refreshToken?: string;
    };
    body: {
        refreshToken?: string;
    };
}

// Response after refreshing the token
export interface RefreshTokenResponse {
    success: boolean;
    message: string;
}

// ---------------------------------- Logout Types ---------------------------------
// Response after successful logout
export interface LogoutResponse {
    success: boolean;
    message: string;
}

// ---------------------------------- Get Current User Types ---------------------------------
export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
    };
}

export interface SuccessResponse {
    success: true;
    message: string;
    user: UserResponse;
}