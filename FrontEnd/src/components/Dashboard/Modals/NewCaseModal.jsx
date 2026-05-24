import { useState } from "react";

export default function NewCaseModal({
  temaClaro,
  fechar
}) {

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [numeroProcesso, setNumeroProcesso] = useState("");
  const [dataOcorrencia, setDataOcorrencia] = useState("");
  const [loading, setLoading] = useState(false);

  function getUserId() {
    const user = JSON.parse(localStorage.getItem("usuario"));
    return user?.id;
  }

  async function criarCaso() {
    if (!titulo || !descricao || !numeroProcesso || !dataOcorrencia) {
      alert("Preencha todos os campos");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/casos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": getUserId()
        },
        body: JSON.stringify({
          titulo,
          descricao,
          numeroProcesso,
          dataOcorrencia
        })
      });

      if (!res.ok) {
        const erro = await res.text();
        console.log("Erro backend:", erro);
        alert("Erro ao criar caso");
        setLoading(false);
        return;
      }

      setLoading(false);

      setTitulo("");
      setDescricao("");
      setNumeroProcesso("");
      setDataOcorrencia("");

      fechar();

    } catch (err) {
      console.log(err);
      setLoading(false);
      alert("Erro de conexão com servidor");
    }
  }

  const inputClass = `
    w-full h-[50px]
    px-4 rounded-[14px]
    border outline-none
    text-[14px]
    transition-all
    ${temaClaro
      ? "bg-white text-black border-zinc-200 focus:border-blue-400"
      : "bg-[#111] text-white border-zinc-800 focus:border-blue-500"}
  `;

  const textareaClass = `
    w-full h-[100px]
    px-4 py-3 rounded-[14px]
    border resize-none outline-none
    text-[14px]
    transition-all
    ${temaClaro
      ? "bg-white text-black border-zinc-200 focus:border-blue-400"
      : "bg-[#111] text-white border-zinc-800 focus:border-blue-500"}
  `;

  return (
    <>
      <div
        onClick={fechar}
        className="
          fixed inset-0 z-[1999]
          bg-black/60 backdrop-blur-[4px]
        "
      />

      <div className={`
        fixed left-1/2 top-1/2
        -translate-x-1/2 -translate-y-1/2
        z-[2000]

        w-[480px] max-[600px]:w-[92%]

        rounded-[22px]
        border
        p-6

        shadow-2xl

        ${temaClaro
          ? "bg-white border-zinc-200"
          : "bg-[#0b0b0b] border-zinc-800"}
      `}>

        <h2 className="text-[22px] font-bold mb-5">
          Criar novo caso
        </h2>

        <div className="flex flex-col gap-3">

          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            type="text"
            placeholder="Título"
            className={inputClass}
          />

          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descrição"
            className={textareaClass}
          />

          <input
            value={numeroProcesso}
            onChange={(e) => setNumeroProcesso(e.target.value)}
            type="text"
            placeholder="Número do processo"
            className={inputClass}
          />

          <input
            value={dataOcorrencia}
            onChange={(e) => setDataOcorrencia(e.target.value)}
            type="date"
            className={inputClass}
          />

        </div>

        <div className="flex justify-end gap-2 mt-5">

          <button
            onClick={fechar}
            className={`
              h-[44px] px-4 rounded-[12px]
              border text-sm
              transition-all

              ${temaClaro
                ? "border-zinc-300 hover:bg-zinc-50"
                : "border-zinc-700 hover:bg-zinc-900"}
            `}
          >
            Cancelar
          </button>

          <button
            onClick={criarCaso}
            disabled={loading}
            className="
              h-[44px] px-5 rounded-[12px]
              bg-blue-600 text-white
              text-sm font-medium
              transition-all
              disabled:opacity-100
            "
          >
            {loading ? "Criando..." : "Criar"}
          </button>

        </div>

      </div>
    </>
  );
}