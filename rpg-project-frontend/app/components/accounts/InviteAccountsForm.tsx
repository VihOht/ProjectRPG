import { useState } from "react";
import toast from "react-hot-toast";
import { useInviteUser } from "../../hooks";
import type { InviteUserRequest } from "../../types";

export default function InviteAccountForm({
  onSucess,
}: {
  onSucess: () => void;
}) {
  const [formData, setFormData] =
    useState<InviteUserRequest>({
      email: "",
      role: "USER",
    });

  const { mutate, isPending } = useInviteUser();

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit() {
    mutate(formData, {
      onSuccess: () => {
        toast.success("Convite enviado!");
        onSucess();
      },
      onError: () => {
        toast.error("Erro ao enviar convite.");
      },
    });
  }

  return (
    <form className="space-y-4 text-vaccineGray-500">
      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        className="w-full rounded-md border px-3 py-2"
      />

      <select
        name="role"
        value={formData.role}
        onChange={handleChange}
        className="w-full rounded-md border px-3 py-2"
      >
        <option value="USER">USER</option>
        <option value="ADMIN">ADMIN</option>
      </select>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isPending}
        className="rounded-md bg-vaccinePurple px-4 py-2 text-white"
      >
        {isPending ? "Enviando..." : "Enviar Convite"}
      </button>
    </form>
  );
}