import CaseCard from "./CaseCard";

export default function CasesGrid({
  temaClaro,
  abrirDetalhes,
  casos
}) {

  if (!casos.length) {

    return (

      <div className="
        text-zinc-500
        text-[15px]
      ">
        Nenhum caso encontrado.
      </div>

    );

  }

  return (

    <div className="
      flex flex-col
      gap-5
      w-full
      max-w-[920px]
      -mt-38
    ">

      {casos.map((caso) => (

        <CaseCard
          key={caso.id}

          id={caso.id}

          temaClaro={temaClaro}

          abrirDetalhes={abrirDetalhes}

          titulo={caso.titulo || "Sem título"}

          status={caso.status || "ABERTO"}

          processo={caso.numeroProcesso || "-"}

          data={caso.dataAbertura || null}

          participantes={`${
            caso.usuarios?.length ||
            caso.participantes ||
            0
          } participantes`}

          evidencias={`${caso.evidencias?.length || 0} evidências`}

          classeStatus={
            caso.status === "ABERTO"
              ? "aberto"
              : caso.status === "EM_ANDAMENTO"
              ? "andamento"
              : caso.status === "CONCLUIDO"
              ? "concluido"
              : "arquivado"
          }
        />

      ))}

    </div>

  );

}