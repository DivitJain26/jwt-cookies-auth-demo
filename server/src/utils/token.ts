import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { getEnv } from '../utils/env.ts'


interface Tokens {
    accessToken: string;
    refreshToken: string;
}

// Generate tokens
export const generateTokens = (userId: string): Tokens => {

    if (!userId) {
        throw new Error("User ID is required to generate tokens");
    }

    // Access token
    const accessToken = jwt.sign(
        { id: userId },
        getEnv('JWT_ACCESS_TOKEN_SECRET') as Secret,
        { expiresIn: getEnv('JWT_ACCESS_TOKEN_AND_COOKIE_EXPIRES_IN') } as SignOptions
    )

    // Refresh token
    const refreshToken = jwt.sign(
        { id: userId },
        getEnv('JWT_REFRESH_TOKEN_SECRET'),
        { expiresIn: getEnv('JWT_REFRESH_TOKEN_AND_COOKIE_EXPIRES_IN') } as SignOptions
    );

    return { accessToken, refreshToken };
}