import { Search } from "lucide-react";
import { useState } from "react";

export default function FiltersBar({
  idioma,
  view,
  filtroCargo,
  setFiltroCargo
}) {
  const [busca, setBusca] = useState("");

  const base =
  "px-4 h-11 rounded-2xl border text-sm transition flex items-center justify-center";

  const ativo = "bg-blue-600 hover:bg-blue-700 text-white border-blue-600 shadow-md";
  const normal = "hover:bg-zinc-900 border-zinc-800 text-zinc-300";

  return (
    <div className="flex justify-between w-full">

      <div className="relative ">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
        />

        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder={idioma === "PT" ? "Buscar usuário..." : "Search user..."}
          className="
            w-130 h-11 rounded-2xl
            pl-10 pr-4 text-sm
            border outline-none transition
            bg-[#0b0b0b] border-zinc-800 text-white
            focus:border-blue-600
          "
        />
      </div>

      {view === "usuarios" && (
        <div className="flex flex-wrap gap-2">

          <button
            onClick={() => setFiltroCargo("TODOS")}
            className={`${base} ${
              filtroCargo === "TODOS" ? ativo : normal
            }`}
          >
            {idioma === "PT" ? "Todos" : "All"}
          </button>

          <button
            onClick={() => setFiltroCargo("DELEGADO")}
            className={`${base} ${
              filtroCargo === "DELEGADO" ? ativo : normal
            }`}
          >
            Delegados
          </button>

          <button
            onClick={() => setFiltroCargo("PERITO")}
            className={`${base} ${
              filtroCargo === "PERITO" ? ativo : normal
            }`}
          >
            Peritos
          </button>

        </div>
      )}

    </div>
  );
}