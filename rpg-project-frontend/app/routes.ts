import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
   route("", "routes/index.tsx"),
   route("classes", "routes/classes.tsx"),
   route("ficha/:id", "routes/rpgSheet.tsx"),
   route("auth/login", "routes/auth/login.tsx"),
   route("auth/register", "routes/auth/register.tsx")
]  satisfies RouteConfig;