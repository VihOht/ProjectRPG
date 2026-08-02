import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { useAuthSession, useLogin } from "../../hooks";
import { useAuthProvider } from "../../providers";
import { StarSky } from "../../components/StarSky";

export default function LoginPage() {
    const { isAuthenticated, isLoading, isReady } = useAuthProvider()
	const navigate = useNavigate();
	const loginMutation = useLogin();
	const { refetch: refetchAuthSession } = useAuthSession();

	const [form, setForm] = useState({
		login_identifier: "",
		password: "",
	});

    useEffect(() => {
        if (isAuthenticated && isReady) {
            navigate("/")
        }
    }, [isAuthenticated, navigate, isReady])

      if (isLoading || !isReady) {
    return (<>
    <StarSky>
      <div className="min-h-screen flex items-center justify-center p-4 font-vollkorn">
        <div className="w-full max-w-md bg-vaccineGray-300 rounded-lg shadow-lg p-8">
          <h1 className="text-4xl text-center font-myFont text-vaccinePurple mb-2">Insonia</h1>
          <p className="text-center text-vaccineBlack mb-6">Verificando autenticação...</p>
        </div>
      </div>
    </StarSky>
    </>)
  }


	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		try {
			await loginMutation.mutateAsync(form);
			await refetchAuthSession();
		} catch {
			// Error is handled in mutation state.
		}
	};

	const errorMessage = loginMutation.error?.response?.data
		? (loginMutation.error.response.data as { message?: string }).message
		: loginMutation.error?.code === "ECONNABORTED"
			? "A API demorou demais para responder. Tente novamente."
			: "Nao foi possivel entrar. Tente novamente.";

	return (
		<StarSky>
			<div className="min-h-screen  text-vaccineBlack flex items-center justify-center p-4 font-vollkorn">
				<div className="w-full max-w-md bg-vaccineGray-300 rounded-lg shadow-lg p-8">
					<h1 className="text-4xl text-center font-myFont text-vaccinePurple mb-2">Insonia</h1>
					<p className="text-center text-vaccineBlack mb-6">Entrar na sua conta</p>

					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label className="block text-sm font-semibold text-vaccineBlack mb-1" htmlFor="login_identifier">
								Username ou Email
							</label>
							<input
								id="login_identifier"
								type="text"
								required
								value={form.login_identifier}
								onChange={(event) => setForm((prev) => ({ ...prev, login_identifier: event.target.value }))}
								className="w-full rounded-md border border-vaccineGray-600 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-vaccinePurple"
							/>
						</div>

						<div>
							<label className="block text-sm font-semibold text-vaccineBlack mb-1" htmlFor="password">
								Senha
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

						{loginMutation.isError ? (
							<p className="text-sm text-vaccinePurple font-semibold">{errorMessage}</p>
						) : null}

						<button
							type="submit"
							disabled={loginMutation.isPending}
							className="w-full px-4 py-2 bg-vaccinePurple rounded-md hover:bg-purple-700 transition-colors disabled:opacity-60 text-white"
						>
							{loginMutation.isPending ? "Entrando..." : "Entrar"}
						</button>
					</form>
				</div>
			</div>
		</StarSky>
	);
}
