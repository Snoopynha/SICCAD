import {
  LogOut,
  Moon,
  Sun,
  Search,
  User
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function Header({
  temaClaro,
  setTemaClaro,
  abrirNovoCaso,
  usuario
}) {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <header className="
      flex justify-between
      items-center
      flex-wrap gap-5
      mb-7
      w-full
    ">

      {/* ESQUERDA */}
      <div className="flex items-center gap-5">

        <div className="
          w-[45px] h-[45px]
          rounded-[24px]
          bg-gradient-to-br
          from-blue-700 to-blue-600
          flex items-center justify-center
          font-bold text-[15px]
          shrink-0
        ">
          {usuario?.nome?.charAt(0) || "U"}
        </div>

        <div>
          <h1 className="text-[28px] font-bold leading-tight">
            Olá, {usuario?.nome || "Usuário"}!
          </h1>

          <p className="text-sm text-zinc-500">
            {usuario?.cargo || "Carregando..."}
          </p>
        </div>
      </div>

      {/* DIREITA */}
      <div className="flex items-center gap-3 flex-wrap">

        <button
          onClick={abrirNovoCaso}
          className="
            h-[45px]
            px-7 rounded-[10px]
            bg-blue-600
            text-white
            font-semibold
            transition-all
          "
        >
          + Novo Caso
        </button>

        {/* BOTÃO TEMA */}
        <button
          onClick={() => setTemaClaro(!temaClaro)}
          className={`
            w-[45px]
            h-[45px]
            rounded-full
            border
            flex
            items-center
            justify-center
            transition-all
            duration-300

            ${
              temaClaro
                ? "bg-white border-zinc-300 text-zinc-700 hover:text-sky-400"
                : "bg-[#0b0b0b] border-zinc-700 text-zinc-300 hover:text-sky-400"
            }
          `}
        >
          {temaClaro ? <Moon size={15} /> : <Sun size={15} />}
        </button>

        <button
          onClick={logout}
          className={`
            w-[45px]
            h-[45px]
            rounded-full
            border
            flex
            items-center
            justify-center
            transition-all
            duration-300
            hover:text-red-400

            ${
              temaClaro
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