import { toast } from "react-hot-toast";
import { Card } from "../components/Card";
import { Header } from "../components/Header";
import { StarSky } from "../components/StarSky";
import { useCreateCharacter, useCharacters, useGetUsers, useDeleteCharacter } from "../hooks";
import { useAuthProvider } from "../providers";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { onlineManager } from "@tanstack/react-query";

export default function Index() {
  const { isAuthenticated, user, isReady } = useAuthProvider();
  const navigate = useNavigate();
  const [isDocumentOpening, setIsDocumentOpening] = useState(false);
  const [isAccountOpening, setIsAccountOpening] = useState(false);


  const { mutate: createCharacter, isPending } = useCreateCharacter();
  const { mutate: deleteCharacter } = useDeleteCharacter();
  const { data: characterData, isLoading: characterLoading, refetch: refetchCharacters } =
    useCharacters();
  const { data: usersData } = useGetUsers(user?.role === "ADMIN");
  const isAdmin = user?.role === "ADMIN";

  const characters = useMemo(
    () => characterData?.characters ?? [],
    [characterData?.characters],
  );
  const playerCharacters = useMemo(
    () => characters.filter((character) => character.is_player),
    [characters],
  );
  const npcCharacters = useMemo(
    () => characters.filter((character) => !character.is_player),
    [characters],
  );

  const userMap = useMemo(() => {
    const map = new Map<number, string>();
    usersData?.users.forEach((u) => {
      map.set(u.id, u.username);
    });
    return map;
  }, [usersData?.users]);

  const getOwnerName = (ownerId: number) => {
    return userMap.get(ownerId) ?? `Usuário #${ownerId}`;
  };

  const onDeleteCharacter = (characterId: number) => {
    if (!confirm("Tem certeza que deseja deletar esta ficha?") || !confirm("Esta ação não pode ser desfeita.")) {
      return;
    }
    deleteCharacter(characterId, {
      onSuccess: () => {
        toast.success("Ficha deletada.");
        refetchCharacters();
      },
      onError: (error) => {
        toast.error(
          error.response?.data?.message || "Erro ao deletar ficha."
        );
      }
    });}

    useEffect(() => {
      if (!isAuthenticated && isReady) {
        navigate("/auth/login");
      }
    }, [isAuthenticated, navigate, isReady]);


  return (
    <StarSky>
      <Header>
        {isAdmin && (
          <Link
            to={`${onlineManager.isOnline() ? "/accounts" : "#"}`}
            className={`px-3 py-2 bg-vaccineGray-300 rounded-md ${isAccountOpening || !onlineManager.isOnline() ? 'bg-vaccineGray-800' : 'hover:bg-vaccineGray-400'} cursor-pointer text-center transition-colors`}
            onClick={() => setIsAccountOpening(true)}
          >
            Contas
          </Link>
        )}
        <Link
          to="/documents"
          className={`px-3 py-2 bg-vaccineGray-300 rounded-md ${isDocumentOpening ? 'bg-vaccineGray-800' : 'hover:bg-vaccineGray-400 cursor-pointer'} text-center transition-colors`}
          onClick={() => setIsDocumentOpening(true)}
        >
          Documentos
        </Link>
        <button
          onClick={() => {
            createCharacter(
              { name: "Novo Personagem" },
              {
                onSuccess: (data) => {
                  navigate(`/ficha/${data.character.id}`);
                },
              },
            );
          }}
          disabled={isPending || !onlineManager.isOnline()}
          className={`px-4 py-2 bg-vaccinePurple ${isPending || !onlineManager.isOnline() ? 'opacity-50' : 'hover:bg-purple-700'} text-white cursor-pointer rounded-md transition-colors`}
        >
          Nova Ficha
        </button>
      </Header>

      <main className="flex-1 flex font-vollkorn items-center justify-center p-8 ">
        <div className="bg-vaccineGray-300/0 md:border-1 md:border-vaccineGray-300/50 text-shadow-lg rounded-lg shadow-lg md:p-8 md:max-w-6xl w-full mx-auto">
          <h3 className="text-4xl w-full text-center font-bold mb-6 text-vaccinePurple ">
            Fichas
          </h3>

          {characterLoading ? (
            <p className="text-center w-full text-gray-500 ">
              Loading characters...
            </p>
          ) : isAdmin ? (
            <div className="space-y-8">
              <section>
                <h4 className="text-2xl font-bold mb-3 text-vaccineBlack ">
                  Players
                </h4>
                <div className="overflow-x-auto rounded-lg border border-gray-300 bg-white">
                  <table className="w-full border-collapse ">
                    <thead className="bg-vaccineGray-400 text-vaccineBlack">
                      <tr>
                        <th className="px-4 py-3 text-left">Nome</th>
                        <th className="px-4 py-3 text-left">Dono</th>
                        <th className="px-4 py-3 text-left">Nível</th>
                        <th className="px-4 py-3 text-left">Ação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {playerCharacters.length > 0 ? (
                        playerCharacters.map((character) => (
                          <tr
                            key={character.id}
                            className="border-t border-gray-200 hover:bg-gray-50"
                          >
                            <td className="px-4 py-3 font-semibold text-vaccineBlack">
                              {character.name}
                            </td>
                            <td className="px-4 py-3 text-vaccineBlack">
                              {getOwnerName(character.own)}
                            </td>
                            <td className="px-4 py-3 text-vaccineBlack">
                              {character.level}
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() =>
                                  navigate(`/ficha/${character.id}`)
                                }
                                className="px-3 py-1.5 rounded-md bg-vaccinePurple text-white hover:bg-purple-700 transition-colors cursor-pointer"
                              >
                                Abrir
                              </button>
                              <button
                                onClick={() => onDeleteCharacter(character.id)}
                                className="ml-2 px-3 py-1.5 rounded-md bg-red-700 text-white hover:bg-red-700/80 transition-colors cursor-pointer"
                              >
                                Deletar
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            className="px-4 py-6 text-center text-gray-500"
                            colSpan={3}
                          >
                            No players found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                <h4 className="text-2xl font-bold mb-3 text-vaccineBlack">
                  NPCs
                </h4>
                <div className="overflow-x-auto rounded-lg border border-gray-300 bg-white">
                  <table className="w-full border-collapse">
                    <thead className="bg-vaccineGray-400 text-vaccineBlack">
                      <tr>
                        <th className="px-4 py-3 text-left">Nome</th>
                        <th className="px-4 py-3 text-left">Nível</th>
                        <th className="px-4 py-3 text-left">Ação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {npcCharacters.length > 0 ? (
                        npcCharacters.map((character) => (
                          <tr
                            key={character.id}
                            className="border-t border-gray-200 hover:bg-gray-50"
                          >
                            <td className="px-4 py-3 font-semibold text-vaccineBlack">
                              {character.name}
                            </td>
                            <td className="px-4 py-3 text-vaccineBlack">
                              {character.level}
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() =>
                                  navigate(`/ficha/${character.id}`)
                                }
                                className="px-3 py-1.5 rounded-md bg-vaccinePurple text-white hover:bg-purple-700 transition-colors"
                              >
                                Abrir
                              </button>
                              <button
                                onClick={() => onDeleteCharacter(character.id)}
                                className="ml-2 px-3 py-1.5 rounded-md bg-red-700 text-white hover:bg-red-700/80 transition-colors cursor-pointer"
                              >
                                Deletar
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            className="px-4 py-6 text-center text-gray-500"
                            colSpan={3}
                          >
                            No NPCs found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          ) : (
            <div>
              <h4 className="text-2xl font-bold mb-3 text-vaccineGray-300">
                Fichas
              </h4>
              <div className="flex flex-wrap gap-4">
                {characters.length > 0 ? (
                  characters.map((character) => (
                    <Card
                      key={character.id}
                      id={character.id}
                      title={character.name}
                      description={`Level ${character.level}`}
                    />
                  ))
                ) : (
                  <p className="text-center w-full text-gray-500">
                    No characters found.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </StarSky>
  );
}
