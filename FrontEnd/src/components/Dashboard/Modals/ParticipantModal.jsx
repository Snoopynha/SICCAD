import { X, UserPlus } from "lucide-react";

export default function ParticipantModal({
  aberto,
  fechar,
  temaClaro,
  buscaUsuario,
  setBuscaUsuario,
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
      <div
        className={`
          fixed left-1/2 top-1/2
          -translate-x-1/2 -translate-y-1/2
          w-[520px] max-w-[92%]
          rounded-[28px]
          border z-[1999]
          p-6 transition-all duration-300

          ${aberto
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"}

          ${temaClaro
            ? "bg-white border-zinc-200 text-black"
            : "bg-[#0b0b0b] border-zinc-800 text-white"}
        `}
      >
        <div className="flex items-center justify-between mb-6">

          <div className="flex items-center gap-3">
            <UserPlus size={20} />
            <h2 className="text-[20px] font-semibold">
              Novo participante
            </h2>
          </div>

          <button
            onClick={fechar}
            className="opacity-60 hover:opacity-100 transition"
          >
            <X size={18} />
          </button>

        </div>


        <div className="mb-5">
          <label className="text-[13px] text-zinc-500 mb-2 block">
            E-mail do usuário
          </label>

          <input
            value={buscaUsuario}
            onChange={(e) => setBuscaUsuario(e.target.value)}
            placeholder="ex: usuario@email.com"
            className={`
              w-full h-[52px]
              px-5 rounded-[14px]
              border outline-none
              transition-all

              focus:border-blue-500

              ${temaClaro
                ? "bg-[#f4f4f5] border-zinc-200"
                : "bg-[#111] border-zinc-800"}
            `}
          />
        </div>

        <p className="text-[12px] text-zinc-500 mb-6">
          O participante será vinculado automaticamente ao caso.
        </p>

        <button
          onClick={adicionarParticipante}
          className="
            w-full h-[52px]
            rounded-[14px]
            bg-blue-600 hover:bg-blue-700
            text-white font-medium
            transition-all
          "
        >
          Vincular participante
        </button>

      </div>
    </>
  );
}