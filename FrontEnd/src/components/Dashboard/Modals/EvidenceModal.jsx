// src/components/Dashboard/Modals/EvidenceModal.jsx

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

      <div className={`
        fixed left-1/2 top-1/2
        -translate-x-1/2 -translate-y-1/2
        w-[560px] max-w-[92%]
        rounded-[32px]
        border z-[1999]
        p-7 transition-all duration-300
        ${aberto
          ? "opacity-100 scale-100"
          : "opacity-0 scale-90 pointer-events-none"}
        ${temaClaro
          ? "bg-white border-zinc-200 text-black"
          : "bg-[#0b0b0b] border-zinc-800 text-white"}
      `}>

        <div className="flex items-center justify-between mb-7">

          <div className="flex items-center gap-3">

            <Upload size={22} />

            <h2 className="text-[24px] font-bold">
              Nova Evidência
            </h2>

          </div>

          <button onClick={fechar}>
            <X />
          </button>

        </div>

        <label className={`
          border-2 border-dashed
          rounded-[24px]
          p-14 text-center block cursor-pointer
          transition-all
          ${temaClaro
            ? "border-zinc-300"
            : "border-zinc-700"}
        `}>

          <input
            type="file"
            hidden
            onChange={(e) =>
              setArquivo(
                e.target.files[0]
              )
            }
          />

          <Upload
            size={42}
            className="
              mx-auto mb-4
              text-blue-500
            "
          />

          <p className="text-[16px] mb-2">

            {arquivo
              ? arquivo.name
              : "Arraste um arquivo ou clique para selecionar"}

          </p>

          <span className="
            text-zinc-500
            text-[14px]
          ">
            PDF, PNG ou JPG — máximo 50MB
          </span>

        </label>

        {arquivo && (

          <div className={`
            mt-5
            p-4
            rounded-[20px]
            border
            ${temaClaro
              ? "border-zinc-200 bg-zinc-50"
              : "border-zinc-800 bg-[#090909]"}
          `}>

            <p className="font-medium">
              {arquivo.name}
            </p>

            <p className="
              text-zinc-500
              text-[13px]
              mt-1
            ">
              {(arquivo.size / 1024 / 1024)
                .toFixed(2)} MB
            </p>

          </div>

        )}

        <div className="
          flex justify-end gap-3
          mt-6
        ">

          <button
            onClick={fechar}
            className={`
              h-[48px]
              px-5
              rounded-[16px]
              border
              ${temaClaro
                ? "bg-[#f4f4f5] border-zinc-200"
                : "bg-[#111111] border-zinc-800"}
            `}
          >
            Cancelar
          </button>

          <button
            onClick={enviarEvidencia}
            className="
              h-[48px]
              px-5
              rounded-[16px]
              bg-blue-600
              hover:bg-blue-700
              transition-all
              text-white
              font-semibold
            "
          >
            Enviar Evidência
          </button>

        </div>

      </div>
    </>
  );
}