import { useState, useEffect, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { useRegister } from "../../hooks";
import { useAuthProvider } from "../../providers";
import { StarSky } from "../../components/StarSky";

export default function RegisterPage() {
  const { isAuthenticated, isLoading } = useAuthProvider()
  const navigate = useNavigate();
  const registerMutation = useRegister();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
        if (isAuthenticated) {
            navigate("/")
        }
}, [isAuthenticated, navigate])

  if (isLoading) {
    return (<>
        <h1>Loading...</h1>
    </>)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await registerMutation.mutateAsync(form);
      navigate("/auth/login");
    } catch {
      // Error is handled in mutation state.
    }
  };

  const errorMessage = registerMutation.error?.response?.data
    ? (registerMutation.error.response.data as { message?: string }).message
    : "Nao foi possivel registrar. Tente novamente.";

  return (
    <StarSky>
      <div className="min-h-screen flex items-center justify-center p-4 font-vollkorn">
        <div className="w-full max-w-md bg-vaccineGray-300 rounded-lg shadow-lg p-8">
          <h1 className="text-4xl text-center font-myFont text-vaccinePurple mb-2">Vaccine</h1>
          <p className="text-center text-vaccineBlack mb-6">Criar nova conta</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-vaccineBlack mb-1" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                type="text"
                required
                value={form.username}
                onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))}
                className="w-full rounded-md border border-vaccineGray-600 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-vaccinePurple"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-vaccineBlack mb-1" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                className="w-full rounded-md border border-vaccineGray-600 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-vaccinePurple"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-vaccineBlack mb-1" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={form.password}
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                className="w-full rounded-md border border-vaccineGray-600 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-vaccinePurple"
              />
            </div>

            {registerMutation.isError ? (
              <p className="text-sm text-vaccinePurple font-semibold">{errorMessage}</p>
            ) : null}

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full px-4 py-2 bg-vaccinePurple text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-60"
            >
              {registerMutation.isPending ? "Registrando..." : "Registrar"}
            </button>
          </form>

          <p className="text-center text-sm text-vaccineBlack mt-6">
            Ja tem conta?{" "}
            <Link to="/auth/login" className="font-semibold text-vaccinePurple hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </StarSky>
  );
}