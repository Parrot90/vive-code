/**
 * An Array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */

export const publicRoutes: string[] = [
   // Add any truly public routes here (like landing pages, about, etc.)
]

/**
 * An Array of routes that are protected
 * These routes require authentication
 * @type {string[]}
 */

export const protectedRoutes: string[] = [
    "/",
    
]

/**
 * An Array of routes that are for authentication
 * These routes are accessible when not logged in
 * @type {string[]}
 */

export const authRoutes: string[] = [
    "/auth/sign-in",
   
]

/**
 * API routes for authentication
 * Routes that start with this (/api/auth) prefix do not require authentication
 * @type {string}
 */

export const apiAuthPrefix: string = "/api/auth"

export const DEFAULT_LOGIN_REDIRECT = "/";