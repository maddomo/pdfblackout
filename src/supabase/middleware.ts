/* eslint-disable */
import { NextResponse, type NextRequest } from "next/server";
import { createMiddlewareTRPCClient } from "~/trpc/middleware";


const unprotectedRoutes = ["/auth", "/api"];
const exactUnprotectedRoutes = ["/"];
/**
 * This middleware function protects routes when the user isn't logged in.
 * The allowed routes that are accessible without being logged in are specified here.
 */
export async function updateSession(request: NextRequest) {
  const api = createMiddlewareTRPCClient(request);
  const supabaseResponse = NextResponse.next({
    request,
  });
 

  // Unprotected routes that are always accessible
  const isUnprotectedRoute =
  unprotectedRoutes.some((x) => request.nextUrl.pathname.startsWith(x)) ||
  exactUnprotectedRoutes.some((x) => request.nextUrl.pathname === x);

  if (isUnprotectedRoute) return supabaseResponse;

  const signUpStatus = await api.auth.isSignedUp.query();
  console.log(signUpStatus);

  if (!signUpStatus.supabase) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }
  if (!signUpStatus.own) {
    // Not fully registered user: should complete his signup
    const url = request.nextUrl.clone();
    url.pathname = "/auth/signupComplete";
    return NextResponse.redirect(url);
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}