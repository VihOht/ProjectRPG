import { useEffect, type ReactNode } from "react";
import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration, type LinksFunction } from "react-router";
import {onlineManager, QueryClient, QueryClientProvider } from "@tanstack/react-query" 
import { AuthProvider } from "./providers";
import "./app.css";
import { Toaster } from "react-hot-toast";
import { StarSky } from "./components/StarSky";
import { setUpOnlineManager, ConnectivityManager } from "./services/onlineManager";
import { syncQueue } from "./sync/syncService";

// links
export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com"},
  { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"},
  { rel: "manifest", href: "/manifest.webmanifest" },
  { rel: "icon", href: "/icon_temporary.png" },
];

// layout html
export function Layout({ children }: {children: ReactNode}) {
  return (
    <html lang="pt-br">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta name="theme-color" content="#000000" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

const queryClient = new QueryClient;
let routeModulesPreloaded = false;

function preloadRouteModules() {
  if (routeModulesPreloaded) return;
  routeModulesPreloaded = true;

  Promise.allSettled([
    import("./routes/documents"),
    import("./routes/rpgSheet"),
    import("./routes/accounts"),
    import("./routes/auth/login"),
    import("./routes/auth/register"),
  ]).then((results) => {
    results.forEach((result) => {
      if (result.status === "rejected") {
        console.warn("Failed to preload route module:", result.reason);
      }
    });
  });
}

if (typeof window !== "undefined") {
  preloadRouteModules();
}

// raiz
export default function App() {
  useEffect(() => {
    setUpOnlineManager();
    preloadRouteModules();
  }, []);

  useEffect(() => {
    if (ConnectivityManager.isOnline()) {
      syncQueue().catch((error) => {
        console.error("Error syncing queue:", error);
      }
      )};
  }, [ConnectivityManager, onlineManager]);

  useEffect(() => {
    window.setInterval(() => {
      if (ConnectivityManager.isOnline()) {
        syncQueue().catch((error) => {
          console.error("Error syncing queue:", error);
        });
      }
      ConnectivityManager.checkApiReachability()
    }, 30000);
  }, []);


  return (
    <QueryClientProvider client={(queryClient)}>
      <Toaster position="bottom-right" />
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </QueryClientProvider>
  )
}

// errors
export function ErrorBoundary({error}: {error: unknown}) {
  let message = "Oops!";
  let details = "An unexpected error ocurred.";
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = 
      error.status === 404
       ? "The requested page could not be found"
       : error.statusText || details
  } else if (import.meta.env.Dev && error instanceof Error) {
    details = error.message
    stack = error.stack
  }

  return (
    <StarSky>
      <main className="pt-16 p-4 container mx-auto text-white">
        <h1>{message}</h1>
        <p>{details}</p>
        {stack && (
          <pre className="w-full text-white p-4 overflox-x-auto">
            <code>{stack}</code>
          </pre>
        )}
        <a href="/" className="text-blue-500 hover:underline">
          Return to Home
        </a>
      </main>
    </StarSky>
  );
}

