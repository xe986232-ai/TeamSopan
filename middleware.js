import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { resolveDashboardRole, isDivisionPathAllowed } from "@/lib/dashboard-role";

// Middleware ini jalan di setiap request:
// 1. Refresh sesi login Supabase (perlu, biar token gak expired diam-diam).
// 2. Kalau halaman yang diakses ada di bawah /dashboard:
//    - belum login -> redirect ke /masuk (biar bisa login dulu)
//    - sudah login TAPI bukan admin (master ATAU admin divisi) ->
//      redirect ke / (home) -- dashboard ini isinya semua buat admin,
//      bukan buat member biasa.
//    - login sebagai admin DIVISI -> cuma boleh buka sub-halaman yang
//      relevan buat divisinya (lihat lib/dashboard-role.js), selain itu
//      di-redirect balik ke /dashboard.
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

    const role = resolveDashboardRole(user.email);

    if (!role) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (
      role.type === "division" &&
      !isDivisionPathAllowed(request.nextUrl.pathname)
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
