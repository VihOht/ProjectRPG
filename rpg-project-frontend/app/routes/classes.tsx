import { useMemo, useState } from "react";
import { Header } from "../components/Header";
import {
  useCreateAbility,
  useCreateClass,
  useCreateSubclass,
  useGetClasses,
} from "../hooks";

export default function ClassesPage() {
  const { data: classesData, isLoading } = useGetClasses();
  const { mutate: createClass, isPending: isCreatingClass } = useCreateClass();
  const { mutate: createSubclass, isPending: isCreatingSubclass } = useCreateSubclass();
  const { mutate: createAbility, isPending: isCreatingAbility } = useCreateAbility();

  const [className, setClassName] = useState("");
  const [classDescription, setClassDescription] = useState("");

  const [subclassName, setSubclassName] = useState("");
  const [subclassDescription, setSubclassDescription] = useState("");
  const [subclassClassId, setSubclassClassId] = useState<string>("");

  const [abilityName, setAbilityName] = useState("");
  const [abilityDescription, setAbilityDescription] = useState("");
  const [abilityClassId, setAbilityClassId] = useState<string>("");
  const [abilitySubclassId, setAbilitySubclassId] = useState<string>("");

  const classes = classesData?.classes ?? [];

  const selectedClassSubclasses = useMemo(() => {
    const classId = Number(abilityClassId);
    if (!classId) {
      return [];
    }

    const selectedClass = classes.find((c) => c.id === classId);
    return selectedClass?.subclasses ?? [];
  }, [abilityClassId, classes]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-vaccineGray-500 to-vaccineGray-600 flex flex-col">
      <Header />

      <main className="flex-1 p-8 space-y-6">
        <section className="max-w-6xl mx-auto bg-vaccineGray-300 rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-vaccineRed mb-2">Classes</h1>
          <p className="text-vaccineBlack mb-6">
            Visualizacao hierarquica: classe, habilidades da classe, subclasses e habilidades das subclasses.
          </p>

          {isLoading ? (
            <p className="text-gray-600">Carregando classes...</p>
          ) : classes.length === 0 ? (
            <p className="text-gray-600">Nenhuma classe cadastrada.</p>
          ) : (
            <div className="space-y-5">
              {classes.map((charClass) => (
                <article key={charClass.id} className="bg-white/70 rounded-md p-4 border border-gray-200">
                  <h2 className="text-2xl font-semibold text-vaccineRed">{charClass.name}</h2>
                  <p className="text-gray-700 mb-3">{charClass.description}</p>

                  <div className="mb-3">
                    <h3 className="font-semibold text-vaccineBlack">Habilidades da Classe</h3>
                    {charClass.abilities && charClass.abilities.length > 0 ? (
                      <ul className="list-disc pl-6 text-gray-800">
                        {charClass.abilities.map((ability) => (
                          <li key={ability.id}>
                            <span className="font-semibold">{ability.name}:</span> {ability.description}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600">Sem habilidades de classe.</p>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold text-vaccineBlack">Subclasses</h3>
                    {charClass.subclasses && charClass.subclasses.length > 0 ? (
                      <div className="space-y-3 mt-2">
                        {charClass.subclasses.map((subclass) => (
                          <div key={subclass.id} className="border-l-4 border-vaccineRed pl-4 py-1">
                            <h4 className="font-semibold text-vaccineBlack">{subclass.name}</h4>
                            <p className="text-gray-700">{subclass.description}</p>

                            <p className="font-medium mt-1">Habilidades da Subclasse</p>
                            {subclass.abilities && subclass.abilities.length > 0 ? (
                              <ul className="list-disc pl-6 text-gray-800">
                                {subclass.abilities.map((ability) => (
                                  <li key={ability.id}>
                                    <span className="font-semibold">{ability.name}:</span> {ability.description}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-gray-600">Sem habilidades de subclasse.</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">Sem subclasses.</p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          <form
            className="bg-vaccineGray-300 rounded-lg shadow-lg p-4 flex flex-col gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              createClass(
                { name: className, description: classDescription },
                {
                  onSuccess: () => {
                    setClassName("");
                    setClassDescription("");
                  },
                }
              );
            }}
          >
            <h3 className="text-xl font-semibold text-vaccineRed">Criar Classe</h3>
            <input
              className="bg-white border border-gray-300 rounded-md px-3 py-2"
              placeholder="Nome"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              required
            />
            <textarea
              className="bg-white border border-gray-300 rounded-md px-3 py-2"
              placeholder="Descricao"
              value={classDescription}
              onChange={(e) => setClassDescription(e.target.value)}
              rows={4}
              required
            />
            <button
              type="submit"
              disabled={isCreatingClass}
              className="px-4 py-2 bg-vaccineRed  rounded-md hover:bg-red-700 transition-colors disabled:opacity-60"
            >
              {isCreatingClass ? "Salvando..." : "Criar"}
            </button>
          </form>

          <form
            className="bg-vaccineGray-300 rounded-lg shadow-lg p-4 flex flex-col gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              createSubclass(
                {
                  name: subclassName,
                  description: subclassDescription,
                  class_id: Number(subclassClassId),
                },
                {
                  onSuccess: () => {
                    setSubclassName("");
                    setSubclassDescription("");
                    setSubclassClassId("");
                  },
                }
              );
            }}
          >
            <h3 className="text-xl font-semibold text-vaccineRed">Criar Subclasse</h3>
            <select
              className="bg-white border border-gray-300 rounded-md px-3 py-2"
              value={subclassClassId}
              onChange={(e) => setSubclassClassId(e.target.value)}
              required
            >
              <option value="">Classe</option>
              {classes.map((c) => (
                <option key={c.id} value={String(c.id)}>
                  {c.name}
                </option>
              ))}
            </select>
            <input
              className="bg-white border border-gray-300 rounded-md px-3 py-2"
              placeholder="Nome"
              value={subclassName}
              onChange={(e) => setSubclassName(e.target.value)}
              required
            />
            <textarea
              className="bg-white border border-gray-300 rounded-md px-3 py-2"
              placeholder="Descricao"
              value={subclassDescription}
              onChange={(e) => setSubclassDescription(e.target.value)}
              rows={4}
              required
            />
            <button
              type="submit"
              disabled={isCreatingSubclass}
              className="px-4 py-2 bg-vaccineRed rounded-md hover:bg-red-700 transition-colors disabled:opacity-60"
            >
              {isCreatingSubclass ? "Salvando..." : "Criar"}
            </button>
          </form>

          <form
            className="bg-vaccineGray-300 rounded-lg shadow-lg p-4 flex flex-col gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              createAbility(
                {
                  name: abilityName,
                  description: abilityDescription,
                  class_id: abilityClassId ? Number(abilityClassId) : undefined,
                  subclass_id: abilitySubclassId ? Number(abilitySubclassId) : undefined,
                },
                {
                  onSuccess: () => {
                    setAbilityName("");
                    setAbilityDescription("");
                    setAbilityClassId("");
                    setAbilitySubclassId("");
                  },
                }
              );
            }}
          >
            <h3 className="text-xl font-semibold text-vaccineRed">Criar Ability</h3>
            <input
              className="bg-white border border-gray-300 rounded-md px-3 py-2"
              placeholder="Nome"
              value={abilityName}
              onChange={(e) => setAbilityName(e.target.value)}
              required
            />
            <textarea
              className="bg-white border border-gray-300 rounded-md px-3 py-2"
              placeholder="Descricao"
              value={abilityDescription}
              onChange={(e) => setAbilityDescription(e.target.value)}
              rows={4}
              required
            />
            <select
              className="bg-white border border-gray-300 rounded-md px-3 py-2"
              value={abilityClassId}
              onChange={(e) => {
                setAbilityClassId(e.target.value);
                setAbilitySubclassId("");
              }}
            >
              <option value="">Classe (opcional)</option>
              {classes.map((c) => (
                <option key={c.id} value={String(c.id)}>
                  {c.name}
                </option>
              ))}
            </select>
            <select
              className="bg-white border border-gray-300 rounded-md px-3 py-2"
              value={abilitySubclassId}
              onChange={(e) => setAbilitySubclassId(e.target.value)}
              disabled={!abilityClassId}
            >
              <option value="">Subclasse (opcional)</option>
              {selectedClassSubclasses.map((s) => (
                <option key={s.id} value={String(s.id)}>
                  {s.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={isCreatingAbility}
              className="px-4 py-2 bg-vaccineRed rounded-md hover:bg-red-700 transition-colors disabled:opacity-60"
            >
              {isCreatingAbility ? "Salvando..." : "Criar"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
