import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Email satu-satunya akun yang boleh akses /dashboard. Diset lewat env var
// ADMIN_EMAIL (bukan di-hardcode di kode), biar gampang diganti tanpa
// perlu ubah kode kalau suatu saat email admin berubah.
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

// Middleware ini jalan di setiap request:
// 1. Refresh sesi login Supabase (perlu, biar token gak expired diam-diam).
// 2. Kalau halaman yang diakses ada di bawah /dashboard:
//    - belum login -> redirect ke /masuk (biar bisa login dulu)
//    - sudah login TAPI bukan email admin -> redirect ke / (home) --
//      dashboard ini isinya semua buat admin, bukan buat member biasa.
// Halaman /masuk sendiri sengaja TIDAK dijaga di sini, karena dia yang
// menangani mode login biasa maupun mode aktivasi (?token=...).
export async function middleware(request) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard");

  if (isDashboardRoute) {
    if (!user) {
      return NextResponse.redirect(new URL("/masuk", request.url));
    }

    const isAdmin =
      !!ADMIN_EMAIL &&
      user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

    if (!isAdmin) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
