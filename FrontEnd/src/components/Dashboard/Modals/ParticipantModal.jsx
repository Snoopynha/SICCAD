// src/components/Dashboard/Modals/ParticipantModal.jsx

import { X, UserPlus } from "lucide-react";

export default function ParticipantModal({
  aberto,
  fechar,
  temaClaro,
  buscaUsuario,
  setBuscaUsuario,
  papelSelecionado,
  setPapelSelecionado,
  adicionarParticipante
}) {

  return (
    <>
      <div
        onClick={fechar}
        className={`
          fixed inset-0 z-[1998]
          transition-all duration-300
          ${aberto
            ? "opacity-100 bg-black/70 backdrop-blur-[6px]"
            : "opacity-0 pointer-events-none"}
        `}
      />

      <div className={`
        fixed left-1/2 top-1/2
        -translate-x-1/2 -translate-y-1/2
        w-[560px] max-w-[92%]
        rounded-[32px]
        border z-[1999]
        p-7 transition-all duration-300
        ${aberto
          ? "opacity-100 scale-100"
          : "opacity-0 scale-90 pointer-events-none"}
        ${temaClaro
          ? "bg-white border-zinc-200"
          : "bg-[#0b0b0b] border-zinc-800"}
      `}>

        <div className="flex items-center justify-between mb-7">

          <div className="flex items-center gap-3">

            <UserPlus size={22} />

            <h2 className="text-[24px] font-bold">
              Novo Participante
            </h2>

          </div>

          <button onClick={fechar}>
            <X />
          </button>

        </div>

        <input
          value={buscaUsuario}
          onChange={(e) => setBuscaUsuario(e.target.value)}
          placeholder="Digite o email do usuário"
          className={`
            w-full h-[56px]
            px-5 rounded-[18px]
            border outline-none mb-5
            ${temaClaro
              ? "bg-[#f4f4f5] border-zinc-200"
              : "bg-[#111111] border-zinc-800"}
          `}
        />

        <select
          value={papelSelecionado}
          onChange={(e) => setPapelSelecionado(e.target.value)}
          className={`
            w-full h-[56px]
            px-5 rounded-[18px]
            border outline-none mb-6
            ${temaClaro
              ? "bg-[#f4f4f5] border-zinc-200"
              : "bg-[#111111] border-zinc-800"}
          `}
        >
          <option value="DELEGADO">DELEGADO</option>
          <option value="PERITO">PERITO</option>
          <option value="ASSISTENTE">ASSISTENTE</option>
        </select>

        <button
          onClick={adicionarParticipante}
          className="
            w-full h-[54px]
            rounded-[18px]
            bg-blue-600 text-white font-semibold
          "
        >
          Vincular Participante
        </button>

      </div>
    </>
  );
}