import { NextResponse } from "next/server";
import { verifyToken } from "./src/lib/auth";
import sidebarConfig from "./src/data/navListData.json";

const publicPaths = ["/", "/login", "/signup", "/contact", "/pricing"];

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // 1 Allow public paths
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 2  Check JWT token
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (err) {
    console.error("Invalid token:", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 3 Role-based access from sidebarConfig
  const matchedItem = sidebarConfig.sidebarItems.find((item) =>
    pathname.startsWith(item.href)
  );

  if (matchedItem) {
    if (!matchedItem.roles.includes(decoded.role)) {
      return NextResponse.redirect(new URL("/", req.url)); // forbidden
    }
  }

  // 4 Pass user info via headers (optional)
  const response = NextResponse.next();
  response.headers.set("x-user-id", decoded.id);
  response.headers.set("x-user-role", decoded.role);
  response.headers.set("x-org-id", decoded.orgId || "");

  return response;
}
