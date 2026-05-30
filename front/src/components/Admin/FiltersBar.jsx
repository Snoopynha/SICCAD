import { Search } from "lucide-react";

export default function FiltersBar({
  idioma,
  view,
  busca,
  setBusca,
  filtroCargo,
  setFiltroCargo,
  filtroStatus,
  setFiltroStatus
}) {
  const base =
    "px-4 h-11 min-w-fit rounded-2xl border text-sm flex items-center justify-center whitespace-nowrap";

  const ativo =
    "bg-blue-600 text-white border-blue-600";

  const normal =
    "border-zinc-800 text-zinc-300 bg-[#101010]";

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 w-full">

      <div className="relative w-full lg:max-w-xl">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
        />

        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder={
            view === "usuarios"
              ? idioma === "PT"
                ? "Buscar usuário..."
                : "Search user..."
              : idioma === "PT"
              ? "Buscar caso..."
              : "Search case..."
          }
          className="
            w-full
            h-11
            rounded-2xl
            pl-10
            pr-4
            text-sm
            border
            outline-none
            bg-[#101010]
            border-zinc-800
            text-white
            focus:border-blue-600
          "
        />
      </div>

      {view === "usuarios" && (
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">

          <button
            onClick={() => setFiltroCargo("TODOS")}
            className={`${base} ${
              filtroCargo === "TODOS" ? ativo : normal
            }`}
          >
            Todos
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

          <button
            onClick={() => setFiltroCargo("AUDITOR")}
            className={`${base} ${
              filtroCargo === "AUDITOR" ? ativo : normal
            }`}
          >
            Auditores
          </button>

        </div>
      )}

      {view === "casos" && (
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">

          <button
            onClick={() => setFiltroStatus("TODOS")}
            className={`${base} ${
              filtroStatus === "TODOS" ? ativo : normal
            }`}
          >
            Todos
          </button>

          <button
            onClick={() => setFiltroStatus("ABERTO")}
            className={`${base} ${
              filtroStatus === "ABERTO" ? ativo : normal
            }`}
          >
            Abertos
          </button>

          <button
            onClick={() => setFiltroStatus("EM_PERICIA")}
            className={`${base} ${
              filtroStatus === "EM_PERICIA" ? ativo : normal
            }`}
          >
            Em perícia
          </button>

          <button
            onClick={() => setFiltroStatus("CONCLUIDO")}
            className={`${base} ${
              filtroStatus === "CONCLUIDO" ? ativo : normal
            }`}
          >
            Concluídos
          </button>

          <button
            onClick={() => setFiltroStatus("ARQUIVADO")}
            className={`${base} ${
              filtroStatus === "ARQUIVADO" ? ativo : normal
            }`}
          >
            Arquivados
          </button>

        </div>
      )}

    </div>
  );
}