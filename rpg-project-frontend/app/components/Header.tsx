import { useState } from "react";
import { useAuthProvider } from "../providers";
import { Link, useNavigate } from "react-router";
import { FiMenu, FiX } from "react-icons/fi";
import { AppModal } from "./ui/AppModal";
import { useUpdateUser } from "../hooks";
import type { UpdateUserInfoRequest } from "../types";
import ChangeOwnPasswordForm from "./accounts/ChangeOwnPasswordForm";
import { ConnectivityManager } from "../services/onlineManager";


export function Header({ children }: { children?: React.ReactNode }) {
    const { user, isAuthenticated, logout, refreshUser } = useAuthProvider();

    const [formData, setFormData] = useState<UpdateUserInfoRequest>({
        username: user?.username || "",
        email: user?.email || "",
    });


    const navigate = useNavigate();
    const { mutate: updateUser, isPending: isUpdatingUser } = useUpdateUser();

    const [isOpen, setIsOpen] = useState(false);
    const [isPerfilOpen, setIsPerfilOpen] = useState(false);
    const [editingProfile, setEditingProfile] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    function handleAuthAction() {
        setIsOpen(false);

        if (isAuthenticated) {
        logout();
        navigate("/auth/login");
        } else {
        navigate("/auth/login");
        }
    }

    function handleUpdateUser() {
        updateUser({ id: user?.id || 0 , userData: {username: formData.username === user?.username ? undefined : formData.username, email: formData.email === user?.email ? undefined : formData.email} as UpdateUserInfoRequest }, {
            onSuccess: () => {
                setIsPerfilOpen(false);
                refreshUser();
            },
            onError: (error) => {
                console.error("Erro ao atualizar usuário:", error);
            }
        });
    }

    function togglePerfilModal() {
      formData.username = user?.username || "";
      formData.email = user?.email || "";
        setIsPerfilOpen((current) => !current);
    }


    return (
        <header className="relative border-b border-vaccineGray-1000 font-trajanPRegular text-black shadow-md">
      <div className="flex items-center justify-between p-4">
        <Link
          to="/"
          onClick={() => setIsOpen(false)}
          className="text-2xl text-white font-trajanPRegular hover:text-vaccinePurple transition-colors"
        >
          Insonia
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-2">
          {children}

          <h1 className="text-xl text-white/30">|</h1>

          {user && (
            <span onClick={() => togglePerfilModal()} className="text-white border p-2 rounded-md border-vaccinePurple/50 hover:border-vaccinePurple hover:bg-gray-900/50 cursor-pointer transition-colors font-trajanPRegular text-lg">
              {user.username}
            </span>
          )}
          

          <button
            onClick={handleAuthAction}
            className="py-2 text-lg text-white border border-vaccinePurple/50 hover:border-vaccinePurple p-2 rounded-md hover:bg-gray-900/50 transition-color cursor-pointer"
          >
            {isAuthenticated ? "Logout" : "Login"}
          </button>
        
          {ConnectivityManager.isOnline() ? (
            <span className="text-green-500 text-sm ml-2">Online</span>
          ) : (
            <span className="text-red-500 text-sm ml-2">Offline</span>
          )}

        </div>

        {/* Mobile button */}
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="md:hidden rounded-md p-2 text-white hover:bg-gray-900 transition-colors"
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile collapsable menu */}
      {isOpen && (
        <div className="md:hidden border-t border-vaccineGray-1000 bg-vaccineBlueTones-1000/95 px-4 py-4">
          <div className="flex flex-col gap-4">
            {children && (
              <div className="flex flex-col gap-3">
                {children}
              </div>
            )}

            {user && (
              <span onClick={() => togglePerfilModal()} className="text-white rounded-md py-2 text-center cursor-pointer hover:bg-gray-900 transition-colors border border-vaccinePurple/50 hover:border-vaccinePurple font-trajanPRegular text-lg">
                {user.username}
              </span>
            )}

            <button
              onClick={handleAuthAction}
              className="w-full border border-vaccinePurple/50 hover:border-vaccinePurple text-center py-2 cursor-pointer text-lg text-white rounded-md hover:bg-gray-900 transition-colors"
            >
              {isAuthenticated ? "Logout" : "Login"}
            </button>
          </div>
        </div>
      )}

      <div className="font-sans">
        <AppModal open={isPerfilOpen} onClose={() => setIsPerfilOpen(false)} title="Perfil">
          <div className="p-4 text-vaccineGray-300 space-y-6">
            <div>
              <div>
                <h2 className="text-xl font-trajanPRegular text-vaccineGray-300 mb-2">Perfil de {user?.username}</h2>
                <p className="text-vaccineGray-500">Aqui você pode ver e editar as informações do seu perfil.</p>
              </div>
              <button
                onClick={() => setEditingProfile((current) => !current)}
                className="mt-4 px-4 py-2 bg-vaccinePurple text-white rounded-md hover:bg-vaccinePurple/80 transition-colors"
              >
                {editingProfile ? "Cancelar Edição" : "Editar Perfil"}
              </button>
              <button
                onClick={() => setIsPasswordModalOpen(true)}
                className="mt-4 ml-4 px-4 py-2 bg-vaccinePurple text-white rounded-md hover:bg-vaccinePurple/80 transition-colors"
              >
                Alterar Senha
              </button>
              <AppModal
                open={isPasswordModalOpen}
                title="Alterar Senha"
                onClose={() => setIsPasswordModalOpen(false)}
            
              >
                
                <ChangeOwnPasswordForm
                  userId={user?.id || 0}
                  onSucess={() => setIsPasswordModalOpen(false)}
                />
      
              </AppModal>
            </div>
            <div>
              <input
                  name="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Username"
                  className="w-full rounded-md border px-3 py-2 mt-4"
                />
                <input
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Email"
                  className="w-full rounded-md border px-3 py-2 mt-4"
                />
                <h2 className="text-lg font-trajanPRegular text-vaccineGray-300 mt-4">
                  Role: {user?.role}
                </h2>
                <div>
                  <button
                    onClick={handleUpdateUser}
                    disabled={isUpdatingUser}
                    className="mt-4 w-full bg-vaccinePurple text-white py-2 rounded-md hover:bg-vaccinePurple/80 transition-colors disabled:opacity-50"
                  >
                    Salvar Alterações
                  </button>
                </div>
            </div>
          </div>
        </AppModal>
      </div>
    </header>
    )
}   
