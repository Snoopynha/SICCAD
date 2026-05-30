import { X } from "lucide-react";

export default function DetailsModal({ data, tipo, fechar }) {
  function formatarStatus(status) {
    const s = String(status || "").toUpperCase();

    switch (s) {
      case "ABERTO":
        return {
          label: "Aberto",
          cor: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
        };

      case "EM_ANDAMENTO":
        return {
          label: "Em andamento",
          cor: "text-blue-400 bg-blue-400/10 border-blue-400/20",
        };

      case "EM_PERICIA":
        return {
          label: "Em perícia",
          cor: "text-violet-400 bg-violet-400/10 border-violet-400/20",
        };

      case "CONCLUIDO":
        return {
          label: "Concluído",
          cor: "text-zinc-300 bg-zinc-300/10 border-zinc-300/20",
        };

      case "ARQUIVADO":
        return {
          label: "Arquivado",
          cor: "text-amber-400 bg-amber-400/10 border-amber-400/20",
        };

      default:
        return {
          label: status,
          cor: "text-zinc-400 bg-zinc-400/10 border-zinc-400/20",
        };
    }
  }

  function formatarPapel(papel) {
    const p = String(papel || "").toUpperCase();

    switch (p) {
      case "PERITO":
        return "Perito";

      case "DELEGADO":
        return "Delegado";

      case "AUDITOR":
        return "Auditor";

      case "ADVOGADO":
        return "Advogado";

      default:
        return papel;
    }
  }

  return (
    <div
      onClick={fechar}
      className="
        fixed inset-0 z-[1000]
        flex items-center justify-center
        bg-black/85
        px-4
      "
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          relative
          w-full
          max-w-[520px]
          max-h-[82vh]
          overflow-y-auto
          rounded-3xl
          border border-zinc-800
          bg-[#0f0f0f]
          shadow-2xl
        "
      >
        <button
          onClick={fechar}
          className="
            absolute top-4 right-4
            w-9 h-9
            rounded-xl
            border border-zinc-800
            flex items-center justify-center
            text-zinc-500
            bg-[#141414]
          "
        >
          <X size={18} />
        </button>

        <div className="p-6">
          <div className="mb-8 pr-12">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-white text-xl font-semibold truncate">
                  {data.nome}
                </h2>

                <p className="text-zinc-500 text-sm mt-1 truncate">
                  {data.email}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-400">
              Casos vinculados
            </p>

            <span className="text-sm text-zinc-500">
              {data.casos?.length || 0}
            </span>
          </div>

          {data.casos?.length === 0 ? (
            <div
              className="
                py-10
                rounded-2xl
                border border-dashed border-zinc-800
                text-center
              "
            >
              <p className="text-zinc-600 text-sm">
                Nenhum caso vinculado
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {data.casos.map((c) => {
                const { label, cor } = formatarStatus(c.status);

                return (
                  <div
                    key={c.id}
                    className="
                      flex items-center justify-between
                      gap-4
                      p-4
                      rounded-2xl
                      border border-zinc-800
                      bg-[#141414]
                    "
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-white text-sm font-medium truncate">
                        {c.titulo}
                      </p>

                      <p className="text-zinc-500 text-xs mt-1">
                        {formatarPapel(c.papel)}
                      </p>
                    </div>

                    <span
                      className={`
                        shrink-0
                        text-xs
                        px-2.5 py-1
                        rounded-full
                        border
                        ${cor}
                      `}
                    >
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}