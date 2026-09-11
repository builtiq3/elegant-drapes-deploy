import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { type ReactNode } from "react";

import appCss from "../styles.css?url";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Ticker } from "@/components/Ticker";
import { PasswordGate } from "@/components/PasswordGate";
import { Toaster } from "@/components/ui/sonner";
import { LuxuryExperience } from "@/components/LuxuryExperience";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "robots", content: "index, follow" },
      { name: "author", content: "AK Drapes Boutique" },
      { name: "description", content: "AK Drapes Boutique — handwoven silk, organza and Banarasi sarees, curated in limited numbers." },
      { name: "keywords", content: "AK Drapes, handwoven sarees, Banarasi sarees, silk sarees, organza sarees, Indian boutique sarees" },
      { property: "og:site_name", content: "AK Drapes Boutique" },
      { property: "og:title", content: "AK Drapes Boutique | Handwoven Festive Sarees" },
      { property: "og:description", content: "Handwoven sarees and made-to-drape couture." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/favicon.png" },
      { property: "og:url", content: "https://akdrapesboutique.com/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "AK Drapes Boutique | Handwoven Festive Sarees" },
      { name: "twitter:description", content: "Handwoven sarees and made-to-drape couture." },
      { name: "twitter:image", content: "/favicon.png" },
    ],
    links: [
      { rel: "canonical", href: "https://akdrapesboutique.com/" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=Inter:wght@300;400;500&display=swap",
      },
      { rel: "icon", href: "/favicon.png", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <head>
        <HeadContent />
      </head>
      <body className="overflow-x-hidden">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <LuxuryExperience>
        <PasswordGate>
          <Ticker />
          <Header />
          <main>
            {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
            <Outlet />
          </main>
          <Footer />
        </PasswordGate>
      </LuxuryExperience>
      <Toaster position="bottom-center" />
    </QueryClientProvider>
  );
}
