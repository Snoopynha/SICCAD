import { useState } from "react";

export default function CreateUserModal({
  temaClaro,
  fecharModal
}) {

  const [senha, setSenha] = useState("");

  function validarSenha(valor) {

    let pontos = 0;

    if (valor.length >= 8) pontos++;
    if (/[A-Z]/.test(valor)) pontos++;
    if (/[0-9]/.test(valor)) pontos++;
    if (/[^a-zA-Z0-9]/.test(valor)) pontos++;

    if (pontos === 4) {
      return {
        texto: "Senha forte",
        largura: "w-full",
        cor: "text-green-400 bg-green-400"
      };
    }

    if (pontos >= 2) {
      return {
        texto: "Senha média",
        largura: "w-2/3",
        cor: "text-yellow-400 bg-yellow-400"
      };
    }

    return {
      texto: "Senha fraca",
      largura: "w-1/3",
      cor: "text-red-400 bg-red-400"
    };
  }

  const statusSenha = validarSenha(senha);

  return (

    <div
      onClick={fecharModal}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-5 z-50"
    >

      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          w-full max-w-[520px]
          rounded-[32px] border p-8 shadow-2xl
          transition-all duration-300

          ${temaClaro
            ? "bg-white/95 border-zinc-200"
            : "bg-[#0b0b0b]/95 border-zinc-800"
          }
        `}
      >

        {/* HEADER */}
        <div className="flex items-center justify-between mb-7">

          <h2 className="text-2xl font-semibold">
            Novo usuário
          </h2>

          <button
            onClick={fecharModal}
            className={`
              w-10 h-10 rounded-full border flex items-center justify-center transition

              ${temaClaro
                ? "border-zinc-300 hover:text-sky-400"
                : "border-zinc-800 hover:text-sky-400"
              }
            `}
          >
            ✕
          </button>

        </div>

        <div className="flex flex-col gap-5">
          <input
            type="text"
            placeholder="Nome completo"
            className={`
              w-full h-14 rounded-2xl px-4
              ${temaClaro ? "bg-zinc-100 text-black" : "bg-[#101010] text-white"}
            `}
          />

          <input
            type="email"
            placeholder="E-mail institucional"
            className={`
              w-full h-14 rounded-2xl px-4
              ${temaClaro ? "bg-zinc-100 text-black" : "bg-[#101010] text-white"}
            `}
          />

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className={`
              w-full h-14 rounded-2xl px-4
              ${temaClaro ? "bg-zinc-100 text-black" : "bg-[#101010] text-white"}
            `}
          />

          <div>

            <div className={`
              w-full h-[6px] rounded-full overflow-hidden
              ${temaClaro ? "bg-zinc-300" : "bg-zinc-800"}
            `}>

              <div
                className={`
                  h-full transition-all duration-300
                  ${statusSenha.largura}
                  ${statusSenha.cor}
                `}
              />

            </div>

            <p className={`text-xs mt-2 ${statusSenha.cor}`}>
              {statusSenha.texto}
            </p>

          </div>

          <select
            className={`
              w-full h-14 rounded-2xl px-4
              ${temaClaro ? "bg-zinc-100 text-black" : "bg-[#101010] text-white"}
            `}
          >
            <option>Delegado</option>
            <option>Perito</option>
          </select>

    
          <div className={`
            rounded-2xl p-4 text-sm
            ${temaClaro
              ? "bg-red-100 border border-red-200 text-red-500"
              : "bg-red-500/10 border border-red-500/20 text-red-400"
            }
          `}>
            Não é permitido cadastrar administradores pela interface.
          </div>

    
          <button className="w-full h-14 rounded-2xl bg-sky-400 text-black  hover:opacity-90 transition">
            Criar usuário
          </button>

        </div>

      </div>

    </div>
  );
}