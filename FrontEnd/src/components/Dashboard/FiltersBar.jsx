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
    h-[52px]
    w-[240px]
    px-6
    pr-12
    rounded-full
    border
    outline-none
    transition-none
    appearance-none
    cursor-pointer
    focus:outline-none
    focus:ring-0
    focus:shadow-none
  `;

  const themeSelect = temaClaro
    ? "bg-[#eceff4] border-zinc-200 text-black"
    : "bg-[#0a0a0a] border-zinc-800 text-white";

  const inputBase = `
    w-full h-[58px] rounded-full
    px-6
    text-[16px]
    border outline-none
    transition-none
    focus:outline-none
    focus:ring-0
    focus:shadow-none
  `;

  const inputTheme = temaClaro
    ? "bg-[#eceff4] border-zinc-200 text-black"
    : "bg-[#0a0a0a] border-zinc-800 text-white";

  return (
    <div className="w-full flex flex-col gap-6">

      <div className="relative w-full">
        <Search
          size={22}
          className="absolute right-7 top-1/2 -translate-y-1/2 text-zinc-500"
        />

        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          type="text"
          placeholder="Digite número do processo, título ou participante"
          className={`${inputBase} ${inputTheme}`}
        />
      </div>

      <div className="flex flex-col items-end gap-4">

        <div className="relative w-[240px]">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={`${baseSelect} ${themeSelect}`}
          >

            <option value="" disabled hidden>
              Todos status
            </option>

            <option value="ABERTO">Aberto</option>
            <option value="EM_ANDAMENTO">Em andamento</option>
            <option value="CONCLUIDO">Concluído</option>
            <option value="ARQUIVADO">Arquivado</option>

          </select>

          <ChevronDown
            size={18}
            className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500"
          />
        </div>

        <div className="relative w-[240px]">
          <select
            value={ordenacao}
            onChange={(e) => setOrdenacao(e.target.value)}
            className={`${baseSelect} ${themeSelect}`}
          >

            <option value="" disabled hidden>
              Ordenar por data
            </option>

            <option value="recentes">Mais recentes</option>
            <option value="antigos">Mais antigos</option>

          </select>

          <ChevronDown
            size={18}
            className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500"
          />
        </div>

      </div>
    </div>
  );
}