import { useState } from "react";
import toast from "react-hot-toast";
import { useCreateUser } from "../../hooks";
import type { CreateUserRequest } from "../../types";

export default function CreateAccountForm({
  onSucess,
}: {
  onSucess: () => void;
}) {
  const [formData, setFormData] =
    useState<CreateUserRequest>({
      username: "",
      email: "",
      password: "",
      role: "USER",
    });

  const { mutate, isPending } = useCreateUser();

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    setFormData((prev: CreateUserRequest) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit() {
    mutate(formData, {
      onSuccess: () => {
        toast.success("Conta criada com sucesso!");
        onSucess();
      },
      onError: () => {
        toast.error("Erro ao criar conta.");
      },
    });
  }

  return (
    <form className="space-y-4 text-vaccineGray-500">
      <input
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Username"
        className="w-full rounded-md border px-3 py-2"
      />

      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        className="w-full rounded-md border px-3 py-2"
      />

      <input
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Senha"
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
        {isPending ? "Criando..." : "Criar Conta"}
      </button>
    </form>
  );
}