import { Search, ChevronDown } from "lucide-react";

export default function FiltersBar({
  temaClaro,
  busca,
  setBusca,
  status,
  setStatus,
  ordenacao,
  setOrdenacao
}) {
  const baseSelect = `
    h-[48px]
    w-full
    min-[1200px]:w-[240px]
    px-5 pr-10
    rounded-[14px]
    border
    outline-none
    cursor-pointer
    appearance-none
    text-sm
    transition-all
    focus:outline-none
  `;

  const themeSelect = temaClaro
    ? "bg-[#f4f6f8] border-zinc-200 text-black"
    : "bg-[#0a0a0a] border-zinc-800 text-white";

  const inputBase = `
    w-full h-[52px]
    rounded-[16px]
    px-5 pl-12
    text-[15px]
    border
    outline-none
    transition-all
    focus:outline-none
  `;

  const inputTheme = temaClaro
    ? "bg-[#f4f6f8] border-zinc-200 text-black"
    : "bg-[#0a0a0a] border-zinc-800 text-white";

  return (
    <div className="w-full flex flex-col gap-5">

      {/* SEARCH */}
      <div className="relative w-full">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
        />

        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          type="text"
          placeholder="Buscar processo, título ou participante..."
          className={`${inputBase} ${inputTheme}`}
        />
      </div>

      {/* FILTERS */}
      <div className="flex flex-col min-[1200px]:items-end gap-3 pb-10 min-[1200px]:pb-0">

        {/* STATUS */}
        <div className="relative w-full min-[1200px]:w-[240px]">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={`${baseSelect} ${themeSelect}`}
          >
            <option value="" disabled hidden>
              Status
            </option>

            <option value="ABERTO">Aberto</option>
            <option value="EM_PERICIA">Em andamento</option>
            <option value="CONCLUIDO">Concluído</option>
            <option value="ARQUIVADO">Arquivado</option>
          </select>

          <ChevronDown
            size={16}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
          />
        </div>

        {/* ORDENACAO */}
        <div className="relative w-full min-[1200px]:w-[240px] mb-25 min-[1200px]:mb-0">
          <select
            value={ordenacao}
            onChange={(e) => setOrdenacao(e.target.value)}
            className={`${baseSelect} ${themeSelect}`}
          >
            <option value="" disabled hidden>
              Ordenar
            </option>

            <option value="recentes">Mais recentes</option>
            <option value="antigos">Mais antigos</option>
          </select>

          <ChevronDown
            size={16}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
          />
        </div>

      </div>
    </div>
  );
}