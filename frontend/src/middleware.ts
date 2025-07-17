import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === 'production',
  });

  const isAdmin = token?.role === "admin";

  const isLoginPage = request.nextUrl.pathname === "/iniciar-sesion";
  const isRegisterPage = request.nextUrl.pathname === "/registrarse";
  const isRecoverAccPage = request.nextUrl.pathname === "/recuperar-cuenta";
  const isProfilePage = request.nextUrl.pathname === "/perfil";
  const isNewArticlePage = request.nextUrl.pathname === "/nuevo-articulo";
  const isAdminPath = request.nextUrl.pathname.startsWith("/admin");

  // Si ya hay sesión, redirige a /inicio
  if (token && (isLoginPage || isRegisterPage || isRecoverAccPage)) {
    return NextResponse.redirect(new URL("/inicio", request.url));
  }

  // Si no hay sesión, entonces no hay perfíl
  if (!token && isProfilePage) {
    return NextResponse.redirect(new URL("/inicio", request.url));
  }

  // Si la sesión es de administrador, permite crear nuevos artículos
  if (!isAdmin && isNewArticlePage) {
    return NextResponse.redirect(new URL("/inicio", request.url));
  }

  // Si la sesión es de administrador, permite ver el panel de administrador
  if (!isAdmin && isAdminPath) {
     return NextResponse.redirect(new URL("/inicio", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/iniciar-sesion",
    "/registrarse",
    "/recuperar-cuenta",
    "/perfil",
    "/nuevo-articulo",
    "/admin",
    '/admin/:path*',
  ],
};