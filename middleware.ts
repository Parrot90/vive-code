import NextAuth from "next-auth";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  publicRoutes,
  authRoutes,
} from "./routes";
import authConfig from "./auth.config";
import { is } from "date-fns/locale";
// import { config } from "process";


const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    const isapiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    // Allow API auth routes
    if(isapiAuthRoute){
        return null;
    }

    // If user is on auth route (sign-in page)
    if(isAuthRoute){
        // If already logged in, redirect to home
        if(isLoggedIn){
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }
        // If not logged in, allow access to sign-in page
        return null;
    }

    // If user is not logged in and trying to access protected routes (including home)
    if(!isLoggedIn && !isPublicRoute){
        return Response.redirect(new URL("/auth/sign-in", nextUrl));
    }

    // Allow access to public routes and authenticated users
    return null;
});

export const config = {
  // copied from clerk
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};