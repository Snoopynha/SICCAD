import {
  LogOut,
  Moon,
  Sun,
  Bell
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Header({
  temaClaro,
  setTemaClaro,
  abrirNovoCaso,
  usuario,
  notificacoes = [],
  notifAberto,
  setNotifAberto
}) {
  const navigate = useNavigate();

  const [idioma, setIdioma] = useState("pt");

  function toggleIdioma() {
    setIdioma((prev) => (prev === "pt" ? "en" : "pt"));
  }

  function logout() {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <header className="
      flex items-center justify-between
      flex-wrap gap-4
      mb-6 w-full
      relative
    ">
      <div className="flex items-center gap-4">

        <div className="
          w-[40px] h-[40px]
          rounded-[18px]
          bg-gradient-to-br from-blue-700 to-blue-600
          flex items-center justify-center
          font-semibold text-[14px]
          text-white
        ">
          {usuario?.nome?.charAt(0) || "U"}
        </div>

        <div className="leading-tight">
          <h1 className="text-[24px] font-bold">
            {idioma === "pt"
              ? `Olá, ${usuario?.nome || "Usuário"}!`
              : `Hello, ${usuario?.nome || "User"}!`}
          </h1>

          <p className="text-[13px] text-zinc-500 mt-[2px]">
            {usuario?.cargo || "Loading..."}
          </p>
        </div>

      </div>

      <div className="flex items-center gap-2">

        <div className="relative">

          <button
            onClick={() => setNotifAberto(!notifAberto)}
            className="
              w-[40px] h-[40px]
              rounded-[30px]
              flex items-center justify-center
              bg-blue-600
              text-white
              text-sm font-medium
              hover:bg-blue-700
              transition-all
            "
          >
            <Bell size={16} />
          </button>

          {notificacoes.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1 rounded-full">
              {notificacoes.length}
            </span>
          )}

          {notifAberto && (
            <div className="absolute right-0 mt-2 w-[340px] bg-[#111] border border-zinc-800 rounded-[12px] p-3 z-[999]">

              <h3 className="text-sm font-semibold mb-3">
                Alertas de segurança
              </h3>

              {notificacoes.length === 0 && (
                <p className="text-zinc-500 text-sm">
                  Nenhuma movimentação suspeita até o momento. Você está em segurança!
                </p>
              )}

              <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">

                {notificacoes.map((n, i) => (
                  <div
                    key={i}
                    className="text-sm p-2 rounded-[8px] bg-red-500/10 border border-red-500/20 text-red-300"
                  >
                    {typeof n === "string"
                      ? n
                      : `Caso ${n.casoId} | ${n.tipo} | IP ${n.ip}`}
                  </div>
                ))}

              </div>
            </div>
          )}

        </div>

        <button
          onClick={abrirNovoCaso}
          className="
            h-[40px]
            px-5 rounded-[10px]
            bg-blue-600
            text-white
            text-sm font-medium
            hover:bg-blue-700
            transition-all
          "
        >
          + Novo caso
        </button>

        <button
          onClick={toggleIdioma}
          className={`
            w-[40px] h-[40px]
            rounded-[10px]
            border
            flex items-center justify-center
            text-[12px] font-semibold
            transition-all
            ${temaClaro
              ? "bg-white border-zinc-300 text-zinc-700"
              : "bg-[#0b0b0b] border-zinc-700 text-zinc-300"
            }
          `}
        >
          {idioma.toUpperCase()}
        </button>
        <button
          onClick={() => setTemaClaro(!temaClaro)}
          className={`
            w-[40px] h-[40px]
            rounded-[10px]
            border
            flex items-center justify-center
            transition-all
            ${temaClaro
              ? "bg-white border-zinc-300 text-zinc-700"
              : "bg-[#0b0b0b] border-zinc-700 text-zinc-300"
            }
          `}
        >
          {temaClaro ? <Moon size={15} /> : <Sun size={15} />}
        </button>
        <button
          onClick={logout}
          className={`
            w-[40px] h-[40px]
            rounded-[10px]
            border
            flex items-center justify-center
            transition-all
            hover:text-red-400
            ${temaClaro
              ? "bg-white border-zinc-300 text-zinc-700"
              : "bg-[#0b0b0b] border-zinc-700 text-zinc-300"
            }
          `}
        >
          <LogOut size={15} />
        </button>

      </div>
    </header>
  );
}