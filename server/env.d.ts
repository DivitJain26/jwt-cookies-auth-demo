declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    CORS_ORIGIN: string;
    PORT?: string;
    MONGO_URI: string;
    JWT_ACCESS_TOKEN_SECRET: string;
    JWT_REFRESH_TOKEN_SECRET: string;
    JWT_ACCESS_TOKEN_EXPIRES_IN: string;
    JWT_REFRESH_TOKEN_EXPIRES_IN: string;
    ACCESS_TOKEN_COOKIE_EXPIRES_IN: string;
    ACCESS_TOKEN_COOKIE_SAME_SITE: 'strict' | 'lax' | 'none';
    REFRESH_TOKEN_COOKIE_EXPIRES_IN: string;
    REFRESH_TOKEN_COOKIE_SAME_SITE: 'strict' | 'lax' | 'none';
  }
}
