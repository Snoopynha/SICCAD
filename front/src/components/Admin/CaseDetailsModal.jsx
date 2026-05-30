import { X } from "lucide-react";

export default function CaseDetailsModal({
  caso,
  fechar
}) {
  function formatarStatus(status) {
    const s = String(status || "").toUpperCase();

    switch (s) {
      case "ABERTO":
        return {
          label: "Aberto",
          cor: "text-emerald-300 bg-emerald-500/10 border-emerald-500/20"
        };

      case "EM_PERICIA":
        return {
          label: "Em perícia",
          cor: "text-violet-300 bg-violet-500/10 border-violet-500/20"
        };

      case "CONCLUIDO":
        return {
          label: "Concluído",
          cor: "text-zinc-300 bg-zinc-500/10 border-zinc-500/20"
        };

      case "ARQUIVADO":
        return {
          label: "Arquivado",
          cor: "text-amber-300 bg-amber-500/10 border-amber-500/20"
        };

      default:
        return {
          label: status,
          cor: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20"
        };
    }
  }

  const { label, cor } = formatarStatus(caso.status);

  return (
    <div
      onClick={fechar}
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          w-[580px]
          max-h-[85vh]
          overflow-y-auto
          rounded-[28px]
          border border-zinc-800
          bg-[#111111]
          shadow-[0_25px_80px_rgba(0,0,0,0.8)]
        "
      >
        <div className="p-6">

          <div className="flex items-start justify-between mb-8">

            <div>
              <h2 className="text-2xl font-semibold text-white">
                {caso.titulo}
              </h2>

              <p className="text-sm text-zinc-500 mt-2">
                Processo {caso.numeroProcesso}
              </p>
            </div>

            <div className="flex items-center gap-3">

              <span
                className={`
                  text-xs
                  px-3 py-1.5
                  rounded-full
                  border
                  font-medium
                  ${cor}
                `}
              >
                {label}
              </span>

              <button
                onClick={fechar}
                className="
                  w-9 h-9
                  rounded-xl
                  border border-zinc-800
                  flex items-center justify-center
                  text-zinc-400
                "
              >
                <X size={16} />
              </button>

            </div>
          </div>

          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-3">
              Descrição
            </p>

            <div
              className="
                rounded-2xl
                border border-zinc-800
                bg-[#161616]
                p-4
                text-sm
                text-zinc-300
                leading-relaxed
              "
            >
              {caso.descricao}
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Envolvidos
            </p>

            <span
              className="
                text-xs
                px-3 py-1
                rounded-full
                bg-zinc-900
                border border-zinc-800
                text-zinc-400
              "
            >
              {caso.usuarios?.length || 0}
            </span>
          </div>

          <div className="flex flex-col gap-3">

            {(caso.usuarios || []).map((vinculo) => (
              <div
                key={vinculo.id.idUsuario}
                className="
                  flex items-center justify-between
                  rounded-2xl
                  border border-zinc-800
                  bg-[#161616]
                  p-4
                "
              >
                <div>
                  <p className="font-medium text-white">
                    {vinculo.usuario.nome}
                  </p>

                  <p className="text-sm text-zinc-500 mt-1">
                    {vinculo.usuario.email}
                  </p>
                </div>

                {vinculo.usuario.cargo && (
                  <span
                    className="
                      text-xs
                      px-3 py-1.5
                      rounded-full
                      border border-zinc-700
                      bg-zinc-800/50
                      text-zinc-300
                    "
                  >
                    {vinculo.usuario.cargo}
                  </span>
                )}
              </div>
            ))}

          </div>

        </div>
      </div>
    </div>
  );
}