import {X, Users, Shield, FileText, MoreVertical} from "lucide-react";
import { useState } from "react";

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
  usuarioLogadoId,
  transferirCustodia,
  aceitarCustodia,
  analisarCustodia,
  devolverCustodia,
  descartarCustodia,
}) {

  const [menuAberto, setMenuAberto] = useState(null);

  function corAvatar(nome) {
    if (!nome) return ["#6b7280", "#6b7280"];

    const cores = [
      ["#ef4444", "#f97316"],
      ["#f97316", "#eab308"],
      ["#eab308", "#22c55e"],
      ["#22c55e", "#06b6d4"],
      ["#06b6d4", "#3b82f6"],
      ["#3b82f6", "#8b5cf6"],
      ["#8b5cf6", "#ec4899"],
      ["#ec4899", "#ef4444"],
    ];

    let hash = 0;

    for (let i = 0; i < nome.length; i++) {
      hash = nome.charCodeAt(i) + ((hash << 5) - hash);
    }

    return cores[Math.abs(hash) % cores.length];
  }

  function formatarData(data) {
    if (!data) return "-";
    return new Date(data).toLocaleString("pt-BR");
  }

  function formatarStatus(status) {

    const s = String(status || "").toUpperCase();

    switch (s) {

      case "ABERTO":
        return "ABERTO";

      case "EM_ANDAMENTO":
        return "EM ANDAMENTO";

      case "EM_PERICIA":
        return "EM PERÍCIA";

      case "CONCLUIDO":
        return "CONCLUÍDO";

      case "ARQUIVADO":
        return "ARQUIVADO";

      case "APREENDIDA":
        return "APREENDIDA";

      case "EM_ANALISE":
      case "ANALISE":
        return "ANÁLISE";

      case "DEVOLVIDA":
        return "DEVOLVIDA";

      case "DESCARTADA":
      case "DESCARTE":
        return "DESCARTE";

      case "TRANSFERIDA":
      case "TRANSFERENCIA":
        return "TRANSFERÊNCIA";

      case "RECEBIMENTO":
        return "RECEBIMENTO";

      default:
        return status;
    }

  }

  function pegarInicial(nome) {
    if (!nome) return "?";
    return nome.charAt(0).toUpperCase();
  }

  const podeConcluir =
    caso?.status === "EM_ANDAMENTO" ||
    caso?.status === "EM_PERICIA";

  const historicoOrdenado = [...(historico || [])].sort((a, b) => {
    const dataA = new Date(a.dataEvento || a.dataCriacao || 0);
    const dataB = new Date(b.dataEvento || b.dataCriacao || 0);
    return dataB - dataA;
  });

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
        w-[820px] max-[1200px]:w-full
        h-screen z-[1000]
        overflow-y-auto transition-all duration-300
        p-6 border-l
        ${temaClaro
          ? "bg-white border-zinc-200 text-black"
          : "bg-[#0b0b0b] border-zinc-800 text-white"}
      `}>

        <button
          onClick={fechar}
          className={`
            w-[42px] h-[42px]
            rounded-[12px]
            border mb-5
            flex items-center justify-center
            ${temaClaro
              ? "border-zinc-200 bg-[#f4f4f5]"
              : "border-zinc-800 bg-[#111111]"}
          `}
        >
          <X size={16} />
        </button>

        <h1 className="text-[24px] font-bold mb-1">
          {caso?.titulo}
        </h1>

        <p className="text-zinc-500 text-[13px] mb-3">
          {caso?.descricao}
        </p>

        <span className="inline-block px-3 py-1 rounded-full text-[12px] bg-blue-600/10 text-blue-400 mb-6">
          {formatarStatus(caso?.status)}
        </span>

        <div className="flex flex-wrap gap-2 mb-6">

          <button
            onClick={iniciarPericia}
            disabled={caso?.status !== "ABERTO"}
            className={`
            h-[40px] px-4 rounded-[12px]
            text-sm transition-all
            ${caso?.status === "ABERTO"
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700"
              }
          `}
          >
            Iniciar
          </button>

          <button
            onClick={concluirCaso}
            disabled={!podeConcluir}
            className={`
            h-[40px] px-4 rounded-[12px]
            text-sm transition-all border
            ${podeConcluir
                ? "border-zinc-600 hover:border-blue-500 text-white"
                : "border-zinc-800 text-zinc-500 cursor-not-allowed bg-[#111111]"
              }
          `}
          >
            Concluir
          </button>

          <button
            onClick={arquivarCaso}
            disabled={caso?.status !== "CONCLUIDO"}
            className={`
            h-[40px] px-4 rounded-[12px]
            text-sm transition-all border
            ${caso?.status === "CONCLUIDO"
                ? "border-zinc-600 hover:border-blue-500 text-white"
                : "border-zinc-800 text-zinc-500 cursor-not-allowed bg-[#111111]"
              }
          `}
          >
            Arquivar
          </button>

          <button
            onClick={reabrirCaso}
            disabled={caso?.status !== "ARQUIVADO"}
            className={`
            h-[40px] px-4 rounded-[12px]
            text-sm transition-all border
            ${caso?.status === "ARQUIVADO"
                ? "border-zinc-600 hover:border-blue-500 text-white"
                : "border-zinc-800 text-zinc-500 cursor-not-allowed bg-[#111111]"
              }
          `}
          >
            Reabrir
          </button>

        </div>
        <div className={`rounded-[16px] border p-4 mb-4 ${temaClaro
          ? "border-zinc-100 bg-zinc-50"
          : "border-zinc-900 bg-[#0f0f0f]"
          }`}>

          <div className="flex justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users size={16} />
              <h2>Participantes</h2>
            </div>

            <button
              onClick={abrirParticipante}
              className="h-[34px] px-3 text-sm bg-blue-600 text-white rounded-[10px]"
            >
              + Vincular
            </button>
          </div>

          {participantes?.length === 0 && (
            <p className="text-zinc-500 text-sm">
              Nenhum participante
            </p>
          )}

          {participantes?.map((p, i) => {

            const self =
              Number(p.idUsuario) === Number(usuarioLogadoId);

            return (
              <div
                key={i}
                className="flex justify-between p-3 mb-2 rounded-[12px] bg-[#141414]"
              >

                <div className="flex items-center gap-3">

                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                    style={{
                      background: `linear-gradient(
                        135deg,
                        ${corAvatar(p.nomeUsuario)[0]},
                        ${corAvatar(p.nomeUsuario)[1]}
                      )`
                    }}
                  >
                    {pegarInicial(p.nomeUsuario)}
                  </div>

                  <div>
                    <p>{p.nomeUsuario}</p>
                    <p className="text-zinc-500 text-sm">
                      {p.papel}
                    </p>
                  </div>
                </div>

                <button
                  disabled={self}
                  onClick={() => removerParticipante(p.idUsuario)}
                >
                  {self ? "Você" : "Desvincular"}
                </button>

              </div>
            );
          })}
        </div>
        <div className="rounded-[16px] p-4 mb-4">

          <div className="flex justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileText size={16} />
              <h2>Evidências</h2>
            </div>

            <button
              onClick={abrirEvidencia}
              className="h-[34px] px-3 bg-blue-600 text-white rounded-[10px]"
            >
              + Upload
            </button>
          </div>

          {evidencias?.length === 0 && (
            <p className="text-zinc-500 text-sm">
              Nenhuma evidência
            </p>
          )}

          {evidencias?.map((e) => {

            const resultado =
              e.resultadoIntegridade ||
              (e.integro === true
                ? "OK"
                : e.integro === false
                  ? "ALTERADO"
                  : null);

            return (
              <div
                key={e.id}
                className="p-4 mb-3 rounded-[16px] bg-[#141414] relative"
              >

                <div className="flex justify-between items-start">

                  <div>

                    <p className="font-medium text-[15px] mb-1">
                      {e.nomeOriginalArquivo || e.nomeArquivo}
                    </p>

                    {resultado && (
                      <p className={`text-xs ${resultado === "OK"
                        ? "text-green-500"
                        : "text-red-500"
                        }`}>
                        {resultado === "OK"
                          ? "✔ Arquivo íntegro"
                          : "✖ Arquivo alterado"}
                      </p>
                    )}

                  </div>

                  <button
                    onClick={() =>
                      setMenuAberto(
                        menuAberto === e.id ? null : e.id
                      )
                    }
                    className="w-9 h-9 rounded-[10px] bg-[#1c1c1c] flex items-center justify-center"
                  >
                    <MoreVertical size={16} />
                  </button>

                </div>
                {menuAberto === e.id && (
                  <div className="
                    absolute right-4 top-14
                    w-[220px]
                    rounded-[14px]
                    bg-[#101010]
                    border border-zinc-800
                    shadow-2xl
                    p-2
                    z-50
                  ">

                    <button
                      onClick={() => {
                        verificarIntegridade(e.id);
                        setMenuAberto(null);
                      }}
                      className="w-full text-left px-3 py-2 rounded-[10px] hover:bg-[#1a1a1a]"
                    >
                      Verificar integridade
                    </button>

                    <button
                      onClick={() => {
                        baixarArquivo(e.id);
                        setMenuAberto(null);
                      }}
                      className="w-full text-left px-3 py-2 rounded-[10px] hover:bg-[#1a1a1a]"
                    >
                      Download
                    </button>

                    <button
                      onClick={() => {
                        transferirCustodia(
                          e.id,
                          prompt("ID destino"),
                          prompt("Justificativa")
                        );
                        setMenuAberto(null);
                      }}
                      className="w-full text-left px-3 py-2 rounded-[10px] hover:bg-[#1a1a1a]"
                    >
                      Transferir custódia
                    </button>

                    <button
                      onClick={() => {
                        aceitarCustodia(e.id);
                        setMenuAberto(null);
                      }}
                      className="w-full text-left px-3 py-2 rounded-[10px] hover:bg-[#1a1a1a]"
                    >
                      Aceitar custódia
                    </button>

                    <button
                      onClick={() => {
                        analisarCustodia(
                          e.id,
                          prompt("Justificativa")
                        );
                        setMenuAberto(null);
                      }}
                      className="w-full text-left px-3 py-2 rounded-[10px] hover:bg-[#1a1a1a]"
                    >
                      Analisar evidência
                    </button>

                    <button
                      onClick={() => {
                        devolverCustodia(
                          e.id,
                          prompt("Justificativa")
                        );
                        setMenuAberto(null);
                      }}
                      className="w-full text-left px-3 py-2 rounded-[10px] hover:bg-[#1a1a1a]"
                    >
                      Devolver evidência
                    </button>

                    <button
                      onClick={() => {
                        descartarCustodia(
                          e.id,
                          prompt("Justificativa")
                        );
                        setMenuAberto(null);
                      }}
                      className="w-full text-left px-3 py-2 rounded-[10px] text-red-400 hover:bg-[#1a1a1a]"
                    >
                      Descartar evidência
                    </button>

                  </div>
                )}

              </div>
            );
          })}
        </div>
        <div className="rounded-[16px] p-4">

          <div className="flex items-center gap-2 mb-5">
            <Shield size={16} />
            <h2>Histórico</h2>
          </div>

          {historicoOrdenado.length === 0 && (
            <p className="text-zinc-500 text-sm">
              Nenhum histórico encontrado
            </p>
          )}

          {historicoOrdenado.map((h, i) => (
            <div key={i} className="mb-3">

              <div className="p-4 rounded-[16px] bg-[#141414]">

                <p className="font-medium text-[14px]">
                  {formatarStatus(h.acao || h.tipoAcao)}
                </p>

                <div className="text-zinc-500 text-sm mt-1 space-y-1">

                  {h.descricaoAcao && (
                    <p>{h.descricaoAcao}</p>
                  )}

                  {h.justificativa && (
                    <p>{h.justificativa}</p>
                  )}

                  {h.custodianteAnterior && (
                    <p>
                      De: {h.custodianteAnterior}
                    </p>
                  )}

                  {h.custodiantePosterior && (
                    <p>
                      Para: {h.custodiantePosterior}
                    </p>
                  )}

                </div>

                <span className="text-xs text-zinc-600 block mt-2">
                  {formatarData(
                    h.dataEvento || h.dataCriacao
                  )}
                </span>

              </div>

            </div>
          ))}

        </div>

      </div>
    </>
  );
}