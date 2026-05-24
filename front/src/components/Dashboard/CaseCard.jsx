export default function CaseCard({
  temaClaro,
  abrirDetalhes,
  id,
  titulo,
  status,
  processo,
  participantes,
  evidencias,
  classeStatus,
  data
}) {

  const cores = {
    aberto: "bg-green-500/10 text-green-400 border border-green-500/20",
    andamento: "bg-yellow-500/10 text-yellow-300 border border-yellow-500/20",
    concluido: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    arquivado: "bg-zinc-500/10 text-zinc-300 border border-zinc-500/20"
  };

  return (
    <div
      onClick={() => abrirDetalhes(id)}
      className={`
        w-full
        rounded-2xl
        border
        p-5
        cursor-pointer
        transition-all duration-200

        ${temaClaro
          ? "bg-white border-zinc-200 border-zinc-300"
          : "bg-[#0a0a0a] border-zinc-800 border-zinc-700"}
      `}
    >

      <p className="text-zinc-500 text-[13px] mb-2">
        Processo nº {processo}
      </p>

      <h2 className="text-[22px] font-semibold leading-snug mb-3">
        {titulo}
      </h2>

      <div className="text-zinc-400 text-[13px] mb-4">
        Última atualização:{" "}
        {data
          ? new Date(data).toLocaleDateString("pt-BR")
          : "-"}
      </div>
      <div className={`
        inline-flex items-center
        px-3 py-1
        rounded-full
        text-[12px]
        font-medium
        ${cores[classeStatus]}
      `}>
        {status === "EM_PERICIA" || status === "EM_ANDAMENTO" ? "EM ANDAMENTO" : status}
      </div>

    </div>
  );
}