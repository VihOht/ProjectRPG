import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { useLogin } from "../../hooks";
import { useAuthProvider } from "../../providers";

export default function LoginPage() {
    const { isAuthenticated, isLoading } = useAuthProvider()
	const navigate = useNavigate();
	const loginMutation = useLogin();

	const [form, setForm] = useState({
		username: "",
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
			await loginMutation.mutateAsync(form);
			navigate("/");
		} catch {
			// Error is handled in mutation state.
		}
	};

	const errorMessage = loginMutation.error?.response?.data
		? (loginMutation.error.response.data as { message?: string }).message
		: "Nao foi possivel entrar. Tente novamente.";

	return (
		<div className="min-h-screen bg-gradient-to-r from-vaccineGray-500 to-vaccineGray-600 flex items-center justify-center p-4 font-vollkorn">
			<div className="w-full max-w-md bg-vaccineGray-300 rounded-lg shadow-lg p-8">
				<h1 className="text-4xl text-center font-myFont text-vaccineRed mb-2">Insonia</h1>
				<p className="text-center text-vaccineBlack mb-6">Entrar na sua conta</p>

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
							className="w-full rounded-md border border-vaccineGray-600 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-vaccineRed"
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
							className="w-full rounded-md border border-vaccineGray-600 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-vaccineRed"
						/>
					</div>

					{loginMutation.isError ? (
						<p className="text-sm text-vaccineRed font-semibold">{errorMessage}</p>
					) : null}

					<button
						type="submit"
						disabled={loginMutation.isPending}
						className="w-full px-4 py-2 bg-vaccineRed text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-60"
					>
						{loginMutation.isPending ? "Entrando..." : "Entrar"}
					</button>
				</form>

				<p className="text-center text-sm text-vaccineBlack mt-6">
					Nao tem conta?{" "}
					<Link to="/auth/register" className="font-semibold text-vaccineRed hover:underline">
						Registrar
					</Link>
				</p>
			</div>
		</div>
	);
}
