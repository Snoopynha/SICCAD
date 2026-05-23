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

    aberto:
      "bg-green-500/10 text-green-400 border border-green-500/20",

    andamento:
      "bg-yellow-500/10 text-yellow-300 border border-yellow-500/20",

    concluido:
      "bg-blue-500/10 text-blue-400 border border-blue-500/20",

    arquivado:
      "bg-zinc-500/10 text-zinc-300 border border-zinc-500/20"

  };

  return (

    <div
      onClick={() => abrirDetalhes(id)}
      className={`
        w-full
        rounded-[28px]
        border
        p-7
        cursor-pointer
        transition-all
        ${temaClaro
          ? "bg-white border-zinc-200"
          : "bg-[#0a0a0a] border-zinc-800"}
      `}
    >

      <p className="
        text-zinc-500
        text-[15px]
        mb-3
      ">
        Processo nº {processo}
      </p>

  
      <h2 className="
        text-[34px]
        leading-tight
        font-bold
        mb-5
      ">
        {titulo}
      </h2>

      <div className="
        flex items-center
        gap-5
        flex-wrap
        text-zinc-400
        text-[15px]
        mb-6
      ">

        <span>
          Última atualização: {

            data
              ? new Date(data)
                .toLocaleDateString("pt-BR")
              : "-"

          }
        </span>

      </div>

      <div className={`
        inline-flex
        items-center
        px-5 py-2
        rounded-full
        text-[13px]
        font-semibold
        ${cores[classeStatus]}
      `}>

        {status === "EM_ANDAMENTO"
          ? "EM ANDAMENTO"
          : status}

      </div>

    </div>

  );

}