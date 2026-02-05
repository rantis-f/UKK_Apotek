import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("token")?.value;
  const userCookie = request.cookies.get("user")?.value;

  let role = "";
  try {
    if (userCookie) {
      const parsedUser = JSON.parse(decodeURIComponent(userCookie));
      role = parsedUser.jabatan || parsedUser.role;
    }
  } catch (e) {
    role = "";
  }

  const isOwner = role === "pemilik";
  const isAdmin = role === "admin";
  const isApoteker = role === "apoteker";
  const isKasir = role === "kasir";
  const isKaryawan = role === "karyawan";

  const isStaff = ["pemilik", "admin", "apoteker", "kasir", "karyawan"].includes(role);
  const isAdminOrOwner = isOwner || isAdmin;
  const canAccessGudang = isOwner || isAdmin || isApoteker || isKaryawan;
  const canAccessKasir = isOwner || isAdmin || isKasir;

  const isAuthPage = pathname === "/login" || pathname === "/admin/login";
  const isDashboardArea = pathname.startsWith("/dashboard") && !pathname.startsWith("/dashboard/shop");
  const isMemberArea = pathname.startsWith("/dashboard/shop");

  if (isAuthPage && token) {
    return isStaff
      ? NextResponse.redirect(new URL("/dashboard", request.url))
      : NextResponse.redirect(new URL("/", request.url));
  }

  if (isDashboardArea) {
    if (!token) return NextResponse.redirect(new URL("/admin/login", request.url));

    if (!isStaff) return NextResponse.redirect(new URL("/", request.url));

    if (pathname.startsWith("/dashboard/laporan-keuangan") || pathname.startsWith("/dashboard/settings")) {
      if (!isOwner) return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (pathname.startsWith("/dashboard/users")) {
      if (!isAdminOrOwner) return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (pathname.startsWith("/dashboard/obat") || pathname.startsWith("/dashboard/distributor") || pathname.startsWith("/dashboard/jenis-obat")) {
      if (!canAccessGudang) return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (pathname.startsWith("/dashboard/kasir") || pathname.startsWith("/dashboard/penjualan")) {
      if (!canAccessKasir) return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  if (isMemberArea) {
    if (!token) return NextResponse.redirect(new URL("/login", request.url));

    if (isStaff) return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};