import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Header } from "../../components/Header";
import { useAuthProvider } from "../../providers";
import { useCreateAbility, useGetClasses, useGetSubclasses } from "../../hooks";

export default function AdminAbilitiesPage() {
  const { isAuthenticated, user } = useAuthProvider();
  const navigate = useNavigate();
  const { mutate: createAbility, isPending } = useCreateAbility();
  const { data: classesData } = useGetClasses();
  const { data: subclassesData } = useGetSubclasses();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [classId, setClassId] = useState<string>("");
  const [subclassId, setSubclassId] = useState<string>("");

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
          <h1 className="text-3xl font-bold text-vaccineRed mb-4">Criar Ability</h1>
          <form
            className="flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              createAbility(
                {
                  name,
                  description,
                  class_id: classId ? Number(classId) : undefined,
                  subclass_id: subclassId ? Number(subclassId) : undefined,
                },
                {
                  onSuccess: () => {
                    setName("");
                    setDescription("");
                    setClassId("");
                    setSubclassId("");
                  },
                }
              );
            }}
          >
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white border border-gray-300 rounded-md px-3 py-2"
              placeholder="Nome da ability"
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
            <select
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              className="bg-white border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Classe (opcional)</option>
              {(classesData?.classes ?? []).map((c) => (
                <option key={c.id} value={String(c.id)}>{c.name}</option>
              ))}
            </select>
            <select
              value={subclassId}
              onChange={(e) => setSubclassId(e.target.value)}
              className="bg-white border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Subclasse (opcional)</option>
              {(subclassesData?.subclasses ?? []).map((s) => (
                <option key={s.id} value={String(s.id)}>{s.name}</option>
              ))}
            </select>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 bg-vaccineRed text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-60"
            >
              {isPending ? "Salvando..." : "Criar Ability"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
