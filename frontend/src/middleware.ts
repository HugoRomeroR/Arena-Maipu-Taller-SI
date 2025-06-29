import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  console.log("🚀 Middleware ejecutándose");

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isLoginPage = request.nextUrl.pathname === "/iniciar-sesion";
  const isRegisterPage = request.nextUrl.pathname === "/registrarse";
  const isRecoverAccPage = request.nextUrl.pathname === "/recuperar-cuenta";

  // Si ya hay sesión, redirige a /inicio
  if (token && (isLoginPage || isRegisterPage || isRecoverAccPage)) {
    return NextResponse.redirect(new URL("/inicio", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/iniciar-sesion",
    "/registrarse",
    "/recuperar-cuenta",
  ],
};