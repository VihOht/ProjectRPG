import type { ReactNode } from "react";
import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration, type LinksFunction } from "react-router";
import {QueryClient, QueryClientProvider } from "@tanstack/react-query" 
import { AuthProvider } from "./providers";
import "./app.css";
import { Toaster } from "react-hot-toast";

// links
export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com"},
  { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"}
];

// layout html
export function Layout({ children }: {children: ReactNode}) {
  return (
    <html lang="pt-br">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
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

// raiz
export default function App() {
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
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflox-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}

