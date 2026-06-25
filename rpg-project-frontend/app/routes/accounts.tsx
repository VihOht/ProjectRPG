// app/routes/accounts.tsx

import { useState } from "react";
import { Header } from "../components/Header";
import { StarSky } from "../components/StarSky";
import { AppModal } from "../components/ui/AppModal";
import { useAuthProvider } from "../providers";
import { useGetUsers, useDeleteUser, useToggleUserActivation } from "../hooks";

import CreateAccountForm from "../components/accounts/CreateAccountsForm";
import InviteAccountForm from "../components/accounts/InviteAccountsForm";
import ChangePasswordForm from "../components/accounts/ChangePasswordForm";

export default function AccountsRoute() {
  const { user } = useAuthProvider();
  const { data, isLoading, refetch } = useGetUsers();
  const { mutate: deleteUser } = useDeleteUser();

  const [createOpen, setCreateOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const { mutate: toggleUserActivation } = useToggleUserActivation();
  const [passwordUserId, setPasswordUserId] =
    useState<number | null>(null);

  if (user?.role !== "ADMIN") {
    return (
      <StarSky>
        <Header />
        <main className="p-8 text-vaccineGray-300">
          Acesso negado.
        </main>
      </StarSky>
    );
  }

  return (
    <StarSky>
      <Header />

      <main className="mx-auto max-w-6xl p-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-walthari text-vaccineGray-300">
            Contas
          </h1>

          <div className="flex gap-3">
            <button
              onClick={() => setInviteOpen(true)}
              className="rounded-md bg-vaccineBlueTones-400 px-4 py-2 text-white"
            >
              Enviar Convite
            </button>

            <button
              onClick={() => setCreateOpen(true)}
              className="rounded-md bg-vaccinePurple px-4 py-2 text-white"
            >
              Criar Conta
            </button>
          </div>
        </div>

        {isLoading ? (
          <p className="text-vaccineGray-300">
            Carregando contas...
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-vaccineGray-300/30">
            <table className="w-full text-left text-vaccineGray-300">
              <thead className="bg-vaccineBlueTones-1000/70">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Usuário</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Ativo?</th>
                  <th className="px-4 py-3 text-right">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody>
                {data?.users.map((account) => (
                  <tr
                    key={account.id}
                    className="border-t border-vaccineGray-300/20"
                  >
                    <td className="px-4 py-3">
                      {account.id}
                    </td>

                    <td className="px-4 py-3">
                      {account.username}
                    </td>

                    <td className="px-4 py-3">
                      {account.email}
                    </td>

                    <td className="px-4 py-3">
                      {account.role}
                    </td>

                    <td className="px-4 py-3">
                      {account.active ? "Sim" : "Não"}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() =>
                          setPasswordUserId(account.id)
                        }
                        className="rounded-md bg-vaccinePurple px-3 py-2 text-sm text-white"
                      >
                        Alterar Senha
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Tem certeza que deseja deletar esta conta?") && confirm("Por Anarion, você tem certeza absoluta disso?")) {
                            deleteUser(account.id);
                          }
                        }}
                        className="ml-2 rounded-md bg-red-500 px-3 py-2 text-sm text-white"
                      >
                        Deletar
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Tem certeza que deseja " + (account.active ? "desativar" : "ativar") + " esta conta?")) {
                            toggleUserActivation(account.id);
                          }
                        }}
                        className="ml-2 rounded-md bg-yellow-500 px-3 py-2 text-sm text-white"
                      >
                        {account.active ? "Desativar" : "Ativar"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <AppModal
          open={createOpen}
          title="Criar Conta"
          onClose={() => setCreateOpen(false)}
        >
          <CreateAccountForm
            onSucess={() => {setCreateOpen(false); refetch();}}
          />
        </AppModal>

        <AppModal
          open={inviteOpen}
          title="Enviar Convite"
          onClose={() => setInviteOpen(false)}
        >
          <InviteAccountForm
            onSucess={() => {setInviteOpen(false); refetch();}}
          />
        </AppModal>

        <AppModal
          open={passwordUserId !== null}
          title="Alterar Senha"
          onClose={() => setPasswordUserId(null)}
        >
          {passwordUserId && (
            <ChangePasswordForm
              userId={passwordUserId}
              onSucess={() => setPasswordUserId(null)}
            />
          )}
        </AppModal>
      </main>
    </StarSky>
  );
}