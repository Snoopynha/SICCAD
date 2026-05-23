// src/components/Dashboard/DetailsPanel.jsx

import {
  X,
  Users,
  Shield,
  FileText,
  Download,
  SearchCheck
} from "lucide-react";

export default function DetailsPanel({
  temaClaro,
  aberto,
  fechar,
  abrirParticipante,
  abrirEvidencia,
  caso,
  participantes,
  evidencias,
  historico,
  removerParticipante,
  verificarIntegridade,
  baixarArquivo,
  iniciarPericia,
  concluirCaso,
  arquivarCaso,
  reabrirCaso,
  usuarioLogadoId
}) {

  function formatarData(data) {

    if (!data) return "-";

    return new Date(data).toLocaleString("pt-BR");

  }

  function formatarStatus(status) {

    if (status === "EM_PERICIA")
      return "EM ANDAMENTO";

    if (status === "CONCLUIDO")
      return "CONCLUÍDO";

    return status;

  }

  const podeConcluir =
    caso?.status === "EM_ANDAMENTO" ||
    caso?.status === "EM_PERICIA";

  return (
    <>
      <div
        onClick={fechar}
        className={`
          fixed inset-0 z-[999]
          transition-all duration-300
          ${aberto
            ? "opacity-100 pointer-events-auto bg-black/70 backdrop-blur-[6px]"
            : "opacity-0 pointer-events-none"}
        `}
      />

      <div className={`
        fixed top-0
        ${aberto ? "right-0" : "-right-[100%]"}
        w-[900px] max-[1200px]:w-full
        h-screen z-[1000]
        overflow-y-auto transition-all duration-300
        p-8 border-l
        ${temaClaro
          ? "bg-white border-zinc-200 text-black"
          : "bg-[#0b0b0b] border-zinc-800 text-white"}
      `}>

        <button
          onClick={fechar}
          className={`
            w-[48px] h-[48px]
            rounded-[16px]
            border mb-7
            flex items-center justify-center
            ${temaClaro
              ? "border-zinc-200 bg-[#f4f4f5]"
              : "border-zinc-800 bg-[#111111]"}
          `}
        >
          <X size={18} />
        </button>

        <h1 className="text-[30px] font-bold mb-3">
          {caso?.titulo}
        </h1>

        <p className="text-zinc-500 mb-4">
          {caso?.descricao}
        </p>

        <div className="mb-8">

          <span className="
            px-4 py-2 rounded-full
            bg-blue-600/10 text-blue-400
            text-[13px] font-semibold
          ">
            {formatarStatus(caso?.status)}
          </span>

        </div>

        {/* AÇÕES */}
        <div className="flex flex-wrap gap-3 mb-8">

          <button
            onClick={iniciarPericia}
            disabled={caso?.status !== "ABERTO"}
            className={`
              h-[48px] px-5 rounded-[16px]
              text-white transition-all
              ${
                caso?.status === "ABERTO"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-zinc-700 cursor-not-allowed opacity-40"
              }
            `}
          >
            Iniciar Perícia
          </button>

          <button
            onClick={concluirCaso}
            disabled={!podeConcluir}
            className={`
              h-[48px] px-5 rounded-[16px]
              border transition-all
              ${
                podeConcluir
                  ? "border-zinc-500 hover:border-blue-500"
                  : "border-zinc-800 opacity-40 cursor-not-allowed"
              }
            `}
          >
            Concluir
          </button>

          <button
            onClick={arquivarCaso}
            disabled={caso?.status !== "CONCLUIDO"}
            className={`
              h-[48px] px-5 rounded-[16px]
              border transition-all
              ${
                caso?.status === "CONCLUIDO"
                  ? "border-zinc-500 hover:border-blue-500"
                  : "border-zinc-800 opacity-40 cursor-not-allowed"
              }
            `}
          >
            Arquivar
          </button>

          <button
            onClick={reabrirCaso}
            disabled={caso?.status !== "ARQUIVADO"}
            className={`
              h-[48px] px-5 rounded-[16px]
              border transition-all
              ${
                caso?.status === "ARQUIVADO"
                  ? "border-zinc-500 hover:border-blue-500"
                  : "border-zinc-800 opacity-40 cursor-not-allowed"
              }
            `}
          >
            Reabrir
          </button>

        </div>

        {/* PARTICIPANTES */}
        <div className={`
          rounded-[28px]
          border
          p-6
          mb-6
          ${temaClaro
            ? "border-zinc-200"
            : "border-zinc-800"}
        `}>

          <div className="flex items-center justify-between mb-6">

            <div className="flex items-center gap-3">

              <Users size={20} />

              <h2 className="text-[20px] font-bold">
                Participantes
              </h2>

            </div>

            <button
              onClick={abrirParticipante}
              className="
                h-[46px]
                px-5
                rounded-[16px]
                bg-blue-600
                text-white
              "
            >
              Adicionar
            </button>

          </div>

          {!participantes.length && (
            <p className="text-zinc-500">
              Nenhum participante.
            </p>
          )}

          {participantes.map((p, index) => {

            const ehUsuarioLogado =
              Number(p.idUsuario) ===
              Number(usuarioLogadoId);

            return (

              <div
                key={index}
                className={`
                  p-5
                  rounded-[22px]
                  border
                  mb-4
                  flex items-center justify-between
                  ${temaClaro
                    ? "border-zinc-200"
                    : "border-zinc-800"}
                `}
              >

                <div>

                  <h4 className="font-semibold text-[17px]">
                    {p.nomeUsuario}
                  </h4>

                  <p className="text-zinc-500 text-[14px]">
                    {p.papel}
                  </p>

                </div>

                <button
                  disabled={ehUsuarioLogado}
                  onClick={() =>
                    removerParticipante(p.idUsuario)
                  }
                  className={`
                    h-[44px]
                    px-5
                    rounded-[14px]
                    border transition-all
                    ${
                      ehUsuarioLogado
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:border-red-500"
                    }
                    ${temaClaro
                      ? "border-zinc-300"
                      : "border-zinc-700"}
                  `}
                >
                  {ehUsuarioLogado
                    ? "Você"
                    : "Remover"}
                </button>

              </div>

            );

          })}

        </div>

        {/* EVIDÊNCIAS */}
        <div className={`
          rounded-[28px]
          border
          p-6
          mb-6
          ${temaClaro
            ? "border-zinc-200"
            : "border-zinc-800"}
        `}>

          <div className="flex items-center justify-between mb-6">

            <div className="flex items-center gap-3">

              <FileText size={20} />

              <h2 className="text-[24px] font-bold">
                Evidências
              </h2>

            </div>

            <button
              onClick={abrirEvidencia}
              className="
                h-[46px]
                px-5
                rounded-[16px]
                bg-blue-600
                text-white
              "
            >
              Nova Evidência
            </button>

          </div>

          {!evidencias.length && (
            <p className="text-zinc-500">
              Nenhuma evidência cadastrada.
            </p>
          )}

          {evidencias.map((evidencia) => (

            <div
              key={evidencia.id}
              className={`
                p-5
                rounded-[22px]
                border
                mb-4
                flex justify-between
                ${temaClaro
                  ? "border-zinc-200"
                  : "border-zinc-800"}
              `}
            >

              <div>

                <h4 className="font-semibold">
                  {evidencia.nomeArquivo}
                </h4>

                <p className="text-zinc-500 text-[14px]">
                  Hash: {evidencia.hashArquivo}
                </p>

              </div>

              <div className="flex gap-2">

                <button
                  onClick={() =>
                    verificarIntegridade(evidencia.id)
                  }
                  className={`
                    h-[42px]
                    px-4
                    rounded-[14px]
                    border
                    flex items-center gap-2
                    ${temaClaro
                      ? "border-zinc-300"
                      : "border-zinc-700"}
                  `}
                >
                  <SearchCheck size={15} />
                  Verificar
                </button>

                <button
                  onClick={() =>
                    baixarArquivo(evidencia.id)
                  }
                  className="
                    h-[42px]
                    px-4
                    rounded-[14px]
                    bg-blue-600
                    text-white
                    flex items-center gap-2
                  "
                >
                  <Download size={15} />
                  Download
                </button>

              </div>

            </div>

          ))}

        </div>

        {/* HISTÓRICO */}
        <div className={`
          rounded-[28px]
          border
          p-6
          ${temaClaro
            ? "border-zinc-200"
            : "border-zinc-800"}
        `}>

          <div className="flex items-center gap-3 mb-7">

            <Shield size={20} />

            <h2 className="text-[24px] font-bold">
              Histórico de Custódia
            </h2>

          </div>

          {!historico.length && (
            <p className="text-zinc-500">
              Nenhum histórico encontrado.
            </p>
          )}

          {historico.map((item, index) => (

            <div
              key={index}
              className="
                border-l-2 border-blue-600
                pl-5 mb-8
              "
            >

              <h4 className="font-semibold">
                {item.acao || item.tipoAcao}
              </h4>

              <p className="text-zinc-500 text-[14px] mb-1">
                {item.justificativa}
              </p>

              <span className="text-zinc-600 text-[12px]">
                {formatarData(
                  item.dataEvento ||
                  item.dataCriacao
                )}
              </span>

            </div>

          ))}

        </div>

      </div>
    </>
  );
}