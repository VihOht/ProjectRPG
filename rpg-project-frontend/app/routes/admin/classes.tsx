import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Header } from "../../components/Header";
import { useAuthProvider } from "../../providers";
import { useCreateClass } from "../../hooks";

export default function AdminClassesPage() {
  const { isAuthenticated, user } = useAuthProvider();
  const navigate = useNavigate();
  const { mutate: createClass, isPending } = useCreateClass();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth/login");
      return;
    }

    if (user?.role !== "ADMIN") {
      navigate("/");
    }
  }, [isAuthenticated, navigate, user?.role]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-vaccineGray-500 to-vaccineGray-600 flex flex-col">
      <Header />
      <main className="flex-1 p-8">
        <div className="max-w-2xl mx-auto bg-vaccineGray-300 rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-vaccineRed mb-4">Criar Classe</h1>
          <form
            className="flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              createClass(
                { name, description },
                {
                  onSuccess: () => {
                    setName("");
                    setDescription("");
                  },
                }
              );
            }}
          >
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white border border-gray-300 rounded-md px-3 py-2"
              placeholder="Nome da classe"
              required
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-white border border-gray-300 rounded-md px-3 py-2"
              placeholder="Descrição"
              rows={4}
              required
            />
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 bg-vaccineRed text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-60"
            >
              {isPending ? "Salvando..." : "Criar Classe"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
