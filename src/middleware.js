import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

// const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
// const PUBLIC_PATHS = ["/login", "/signup", "/api/auth"];
// const DASHBOARD_PATH = "/dashboard";


  // const PUBLIC_PATHS = ["/login", "/signup", "/verify-otp"];

  export async function middleware(req) {
    // const token = req.cookies.get("token")?.value;
    // const { pathname } = req.nextUrl;

    // if (PUBLIC_PATHS.includes(pathname)) return NextResponse.next();

    // if (!token) {
    //   return NextResponse.redirect(new URL("/login", req.url));
    // }

    // try {
    //   await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    //   return NextResponse.next();
    // } catch {
    //   return NextResponse.redirect(new URL("/login", req.url));
    // }
  }


// import { NextResponse } from "next/server";
// import { jwtVerify } from "jose";

// const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
// const PUBLIC_PATHS = [
//   "/",
//   "/login",
//   "/signup",
//   "/forgot-password",
//   "/verify-otp",
//   "/api/auth/logout",
// ];

// const DASHBOARD_PATH = "/dashboard";

// export async function middleware(request) {
//   const { pathname } = request.nextUrl;

//   // 1. Skip for internal or API routes
//   if (
//     pathname.startsWith("/_next") ||
//     pathname.startsWith("/favicon") ||
//     pathname.startsWith("/api/")
//   ) {
//     return NextResponse.next();
//   }

//   // 2. Read JWT
//   const token = request.cookies.get("token")?.value;

//   // 3. Allow public routes if no token
//   if (!token && PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
//     return NextResponse.next();
//   }

//   // 4. Prevent logged-in users from visiting auth pages (but NOT "/")
//   if (
//     token &&
//     ["/login", "/signup", "/forgot-password", "/verify-otp"].some((p) =>
//       pathname.startsWith(p)
//     )
//   ) {
//     return NextResponse.redirect(new URL(DASHBOARD_PATH, request.url));
//   }

//   // 5. Redirect to login if protected route and no token
//   if (!token && !PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   // 6. Verify JWT
//   let user;
//   try {
//     const { payload } = await jwtVerify(token, SECRET);
//     user = payload;
//   } catch (err) {
//     console.error("Invalid token:", err);
//     const res = NextResponse.redirect(new URL("/login", request.url));
//     res.cookies.delete("token");
//     return res;
//   }

//   // // 7. Admins can go anywhere
//   // if (user.role === "Admin") {
//   //   return NextResponse.next();
//   // }

//   // 8. Dynamic permission check (for non-admins)
//   try {
//     const baseURL = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;
//     const response = await fetch(
//       `${baseURL}/api/permissions?role=${encodeURIComponent(user.role)}`,
//       { cache: "no-store" }
//     );

//     if (!response.ok) throw new Error("Failed to fetch permissions");

//     const permissions = await response.json();
//     const allowedHrefs = permissions.map((p) => p.href);

//     const isAllowed = allowedHrefs.some((href) => pathname.startsWith(href));
//     if (!isAllowed) {
//       return NextResponse.redirect(new URL("/404", request.url));
//     }
//   } catch (err) {
//     console.error("Permission check failed:", err);
//     return NextResponse.redirect(new URL("/404", request.url));
//   }

//   // 9. Everything OK
//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
// };
