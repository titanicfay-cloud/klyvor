import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { canAccessTool, PlanId, ToolId } from "@/lib/plans";

const ROUTE_TOOLS: { prefix: string; tool: ToolId }[] = [
  { prefix: "/dashboard/time-tracker", tool: "time-tracker" },
  { prefix: "/dashboard/projects", tool: "projects" },
  { prefix: "/dashboard/clients", tool: "clients" },
  { prefix: "/dashboard/proposals", tool: "proposals" },
  { prefix: "/dashboard/resumes", tool: "resumes" },
  { prefix: "/dashboard/invoices", tool: "invoices" },
  { prefix: "/dashboard/expenses", tool: "expenses" },
];

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;

  if (!user && pathname.startsWith("/dashboard")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && pathname.startsWith("/dashboard")) {
    for (const route of ROUTE_TOOLS) {
      if (pathname === route.prefix || pathname.startsWith(route.prefix + "/")) {
        const { data: sub } = await supabase
          .from("user_subscriptions")
          .select("plan_id, status")
          .eq("user_id", user.id)
          .single();
        const planId = ((sub?.status === "active" ? sub.plan_id : "free") || "free") as PlanId;
        if (!canAccessTool(planId, route.tool)) {
          const url = request.nextUrl.clone();
          url.pathname = "/dashboard/settings/billing";
          return NextResponse.redirect(url);
        }
        break;
      }
    }
  }

  if (pathname.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();
    if (!roleData || !["owner", "admin", "support"].includes(roleData.role)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
