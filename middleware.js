import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Middleware ini jalan di setiap request:
// 1. Refresh sesi login Supabase (perlu, biar token gak expired diam-diam).
// 2. Kalau halaman yang diakses ada di bawah /dashboard dan user belum
//    login, redirect ke /masuk.
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

  if (isDashboardRoute && !user) {
    const redirectUrl = new URL("/masuk", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
