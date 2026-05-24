import { X, Upload } from "lucide-react";

export default function EvidenceModal({
  aberto,
  fechar,
  temaClaro,
  arquivo,
  setArquivo,
  enviarEvidencia
}) {
  return (
    <>
      <div
        onClick={fechar}
        className={`
          fixed inset-0 z-[1998]
          transition-all duration-300
          ${aberto
            ? "opacity-100 pointer-events-auto bg-black/70 backdrop-blur-[6px]"
            : "opacity-0 pointer-events-none"}
        `}
      />

      <div
        className={`
          fixed left-1/2 top-1/2
          -translate-x-1/2 -translate-y-1/2
          w-[560px] max-w-[92%]
          rounded-[28px]
          border z-[1999]
          p-6 transition-all duration-300

          ${aberto ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}

          ${temaClaro
            ? "bg-white border-zinc-200 text-black"
            : "bg-[#0b0b0b] border-zinc-800 text-white"}
        `}
      >

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Upload size={20} />
            <h2 className="text-[20px] font-semibold">
              Nova Evidência
            </h2>
          </div>

          <button
            onClick={fechar}
            className="opacity-70 hover:opacity-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        <label
          className={`
            relative flex flex-col items-center justify-center
            border-2 border-dashed
            rounded-[20px]
            p-10
            cursor-pointer
            transition-all

            hover:border-blue-500 hover:bg-blue-500/5

            ${temaClaro
              ? "border-zinc-300"
              : "border-zinc-700"}
          `}
        >
          <input
            type="file"
            className="hidden"
            onChange={(e) => setArquivo(e.target.files[0])}
          />

          <Upload size={36} className="text-blue-500 mb-3" />

          <p className="text-[15px] text-center font-medium">
            {arquivo
              ? arquivo.name
              : "Clique ou arraste um arquivo aqui"}
          </p>

          <span className="text-[12px] text-zinc-500 mt-1">
            PDF, PNG ou JPG • até 50MB
          </span>
        </label>

        {arquivo && (
          <div
            className={`
              mt-4 p-4 rounded-[16px]
              border text-sm

              ${temaClaro
                ? "border-zinc-200 bg-zinc-50"
                : "border-zinc-800 bg-[#111]"}
            `}
          >
            <p className="font-medium">{arquivo.name}</p>
            <p className="text-zinc-500 text-xs mt-1">
              {(arquivo.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={fechar}
            className={`
              h-[44px] px-5 rounded-[14px] border text-sm

              ${temaClaro
                ? "border-zinc-200 hover:bg-zinc-100"
                : "border-zinc-800 hover:bg-zinc-900"}
            `}
          >
            Cancelar
          </button>

          <button
            onClick={enviarEvidencia}
            className="
              h-[44px] px-5 rounded-[14px]
              bg-blue-600 hover:bg-blue-700
              text-white text-sm font-medium
              transition-all
            "
          >
            Enviar
          </button>

        </div>
      </div>
    </>
  );
}