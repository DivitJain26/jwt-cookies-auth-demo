import { Response } from 'express';
import ms from "ms";
import { getEnv } from "./env.ts";

export type SameSiteOption = 'strict' | 'lax' | 'none';

export interface CookieOptions {
    httpOnly: boolean;
    secure: boolean;
    sameSite?: SameSiteOption;
    maxAge?: number;
    path?: string;
    domain?: string;
};

// Set cookies
export const setTokenCookies = (res: Response, accessToken: string, refreshToken: string): void => {
    // Common cookie options
    const baseCookieOptions: Pick<CookieOptions, 'httpOnly' | 'secure' | 'sameSite'> = {
        httpOnly: true,
        secure: (getEnv('NODE_ENV') === 'production'),
        sameSite: getEnv('ACCESS_AND_REFRESH_TOKEN_COOKIE_SAME_SITE') as SameSiteOption,
    }

    // Set access token in cookie
    res.cookie('accessToken', accessToken, {
        ...baseCookieOptions,
        maxAge: ms(getEnv('JWT_ACCESS_TOKEN_AND_COOKIE_EXPIRES_IN') as ms.StringValue),
        path: '/'
    });

    // Set refresh token in cookie
    res.cookie('refreshToken', refreshToken, {
        ...baseCookieOptions,
        maxAge: ms(getEnv('JWT_REFRESH_TOKEN_AND_COOKIE_EXPIRES_IN') as ms.StringValue),
        path: '/api/auth/refresh', // Only sent to refresh endpoint
    });
};