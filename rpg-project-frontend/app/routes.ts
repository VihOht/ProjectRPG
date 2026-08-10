import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
   // rota raiz 
   route("", "routes/index.tsx"),
   // 
   route("documents", "routes/documents.tsx"),
   route("ficha/:id", "routes/rpgSheet.tsx"),
   route("auth/login", "routes/auth/login.tsx"),
   route("auth/register/:token", "routes/auth/register.tsx"),
   route("accounts", "routes/accounts.tsx"),
]  satisfies RouteConfig;