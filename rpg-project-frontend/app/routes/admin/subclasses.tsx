import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Header } from "../../components/Header";
import { useAuthProvider } from "../../providers";
import { useCreateSubclass, useGetClasses } from "../../hooks";

export default function AdminSubclassesPage() {
  const { isAuthenticated, user } = useAuthProvider();
  const navigate = useNavigate();
  const { mutate: createSubclass, isPending } = useCreateSubclass();
  const { data: classesData } = useGetClasses();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [classId, setClassId] = useState<string>("");

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
          <h1 className="text-3xl font-bold text-vaccinePurple mb-4">Criar Subclasse</h1>
          <form
            className="flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              createSubclass(
                { name, description, class_id: Number(classId) },
                {
                  onSuccess: () => {
                    setName("");
                    setDescription("");
                    setClassId("");
                  },
                }
              );
            }}
          >
            <select
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              className="bg-white border border-gray-300 rounded-md px-3 py-2"
              required
            >
              <option value="">Selecione a classe</option>
              {(classesData?.classes ?? []).map((c) => (
                <option key={c.id} value={String(c.id)}>{c.name}</option>
              ))}
            </select>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white border border-gray-300 rounded-md px-3 py-2"
              placeholder="Nome da subclasse"
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
              className="px-4 py-2 bg-vaccinePurple text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-60"
            >
              {isPending ? "Salvando..." : "Criar Subclasse"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
