import { useState } from "react";
import toast from "react-hot-toast";
import { useChangePassword } from "../../hooks";

export default function ChangePasswordForm({
  onSucess,
}: {
  userId: number;
  onSucess: () => void;
}) {
  const [password, setPassword] = useState("");

  const { mutate, isPending } =
    useChangePassword();

  function handleSubmit() {
    if (!password.trim()) {
      toast.error("Informe uma senha.");
      return;
    }

    mutate(
      { password },
      {
        onSuccess: () => {
          toast.success("Senha alterada!");
          onSucess();
        },
        onError: () => {
          toast.error("Erro ao alterar senha.");
        },
      }
    );
  }

  return (
    <form className="space-y-4 text-vaccineGray-500">
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Nova senha"
        className="w-full rounded-md border px-3 py-2"
      />

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isPending}
        className="rounded-md bg-vaccinePurple px-4 py-2 text-white"
      >
        {isPending ? "Salvando..." : "Alterar Senha"}
      </button>
    </form>
  );
}