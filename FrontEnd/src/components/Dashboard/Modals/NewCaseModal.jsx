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
      console.log("Erro conexão:", err);
      setLoading(false);
      alert("Erro de conexão com servidor");
    }
  }

  const inputClass = `
    w-full h-[54px] px-5 rounded-[16px] border outline-none
    ${temaClaro
      ? "bg-white text-black border-zinc-300"
      : "bg-[#111] text-white border-zinc-700"}
  `;

  const textareaClass = `
    w-full h-[110px] px-5 py-3 rounded-[16px] border resize-none outline-none
    ${temaClaro
      ? "bg-white text-black border-zinc-300"
      : "bg-[#111] text-white border-zinc-700"}
  `;

  return (
    <div className={`
      fixed left-1/2 top-1/2
      -translate-x-1/2 -translate-y-1/2
      z-[2000]
      w-[520px] max-[700px]:w-[92%]
      max-h-[90vh] overflow-y-auto
      rounded-[30px] border p-7
      ${temaClaro
        ? "bg-white border-zinc-200"
        : "bg-[#0b0b0b] border-zinc-800"}
    `}>

      <h2 className="text-[28px] font-bold mb-6">
        Criar Novo Caso
      </h2>

      <div className="flex flex-col gap-4">

        <input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          type="text"
          placeholder="Título do caso"
          className={inputClass}
        />

        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Descrição do caso"
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

        <div className="flex justify-end gap-3 mt-2">

          <button
            onClick={fechar}
            className={`
              h-[52px] px-6 rounded-[16px] border
              ${temaClaro
                ? "border-zinc-300 text-black"
                : "border-zinc-700 text-white"}
            `}
          >
            Cancelar
          </button>

          <button
            onClick={criarCaso}
            disabled={loading}
            className="h-[52px] px-6 rounded-[16px] bg-blue-600 text-white"
          >
            {loading ? "Criando..." : "Criar Caso"}
          </button>

        </div>

      </div>
    </div>
  );
}