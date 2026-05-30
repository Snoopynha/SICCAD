function formatarStatus(status) {
  const s = String(status || "").toUpperCase();

  switch (s) {
    case "ABERTO":
      return {
        label: "Aberto",
        cor: "text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
      };

    case "EM_ANDAMENTO":
      return {
        label: "Em andamento",
        cor: "text-blue-300 bg-blue-500/10 border-blue-500/20",
      };

    case "EM_PERICIA":
      return {
        label: "Em perícia",
        cor: "text-violet-300 bg-violet-500/10 border-violet-500/20",
      };

    case "CONCLUIDO":
      return {
        label: "Concluído",
        cor: "text-zinc-300 bg-zinc-500/10 border-zinc-500/20",
      };

    case "ARQUIVADO":
      return {
        label: "Arquivado",
        cor: "text-amber-300 bg-amber-500/10 border-amber-500/20",
      };

    default:
      return {
        label: status,
        cor: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20",
      };
  }
}

export default function CasesList({ casos, onClick }) {
  return (
    <>
      {casos.map((caso) => {
        const { label, cor } = formatarStatus(caso.status);

        return (
          <div
            key={caso.id}
            onClick={() => onClick(caso)}
            className="
              cursor-pointer
              rounded-[22px]
              border border-zinc-800
              bg-[#101010]
              p-5
            "
          >
            <div className="flex items-start justify-between gap-4">

              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium text-[15px] truncate">
                  {caso.titulo}
                </h3>

                <p className="text-zinc-500 text-sm mt-2 line-clamp-2">
                  {caso.descricao || "Sem descrição"}
                </p>
              </div>

              <span
                className={`
                  text-xs
                  font-medium
                  px-3 py-1.5
                  rounded-full
                  border
                  shrink-0
                  ${cor}
                `}
              >
                {label}
              </span>

            </div>

            <div className="mt-5 pt-4 border-t border-zinc-800 flex items-center justify-between">

              <span className="text-xs text-zinc-500">
                Processo #{caso.numeroProcesso}
              </span>

              <span className="text-xs text-zinc-400">
                {caso.usuarios?.length || 0} envolvidos
              </span>

            </div>
          </div>
        );
      })}
    </>
  );
}