import { LogOut, Search, Moon, Sun } from "lucide-react";
import { useState } from "react";

export default function AdminHeader({
  temaClaro,
  setTemaClaro
}) {

  const [idioma, setIdioma] = useState("PT");

  return (

    <div className="flex items-center justify-between mb-8">

      {/* SEARCH */}
      <div className="relative w-[450px]">

        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
        />

        <input
          type="text"
          placeholder={idioma === "PT" ? "Buscar usuário..." : "Search user..."}
          className={`
            w-full h-10 rounded-full pl-10 pr-4 text-sm outline-none transition-all

            ${temaClaro
              ? "bg-white border border-zinc-300 text-black"
              : "bg-[#101010] border border-zinc-800 text-white"
            }
          `}
        />

      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-3">

        {/* IDIOMA */}
        <button className={`
          h-10 px-4 rounded-full border text-sm transition

          ${temaClaro
            ? "border-zinc-300 hover:bg-zinc-100"
            : "border-zinc-800 hover:bg-zinc-900"
          }
        `}>
          {idioma}
        </button>

        {/* TEMA (ICON ONLY) */}
        <button
          onClick={() => setTemaClaro(!temaClaro)}
          className={`
            h-10 w-10 rounded-full border flex items-center justify-center transition

            ${temaClaro
              ? "border-zinc-300 hover:bg-zinc-100"
              : "border-zinc-800 hover:bg-zinc-900"
            }
          `}
        >
          {temaClaro ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        {/* LOGOUT */}
        <button className="h-10 px-4 rounded-full bg-red-500 hover:bg-red-400 transition text-sm font-medium flex items-center gap-2 text-white">
          <LogOut size={15} />
          {idioma === "PT" ? "Sair" : "Logout"}
        </button>

      </div>

    </div>

  );
}