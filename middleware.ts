// middleware.ts (projenizin root klasöründe)
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Korunması gereken route'ları tanımlayın
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/profile(.*)",
  "/admin(.*)",
  // Diğer korumalı route'larınızı buraya ekleyin
]);

export default clerkMiddleware(async (auth, req) => {
  // Sadece korumalı route'larda authentication gerekli
  if (isProtectedRoute(req)) {
    const { userId } = await auth();
    if (!userId) {
      // Redirect to sign-in page if not authenticated
      return Response.redirect(new URL("/sign-in", req.url));
    }
  }

  // Diğer tüm route'lar serbestçe erişilebilir
  // Sign-out sonrası otomatik yönlendirme yapılmaz
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
