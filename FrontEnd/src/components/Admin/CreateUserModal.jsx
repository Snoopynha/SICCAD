import { useState } from "react";

export default function CreateUserModal({ temaClaro, fecharModal }) {
  const [senha, setSenha] = useState("");
  const [cpf, setCpf] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cargo, setCargo] = useState("");

  function validarSenha(valor) {
    if (!valor) {
      return {
        texto: "Digite uma senha",
        largura: "w-0",
        corTexto: "text-zinc-400",
        corBg: "bg-zinc-400"
      };
    }

    let pontos = 0;
    if (valor.length >= 8) pontos++;
    if (/[A-Z]/.test(valor)) pontos++;
    if (/[0-9]/.test(valor)) pontos++;
    if (/[^a-zA-Z0-9]/.test(valor)) pontos++;

    if (pontos === 4) {
      return {
        texto: "Senha forte",
        largura: "w-full",
        corTexto: "text-green-400",
        corBg: "bg-green-400"
      };
    }

    if (pontos >= 2) {
      return {
        texto: "Senha média",
        largura: "w-2/3",
        corTexto: "text-yellow-400",
        corBg: "bg-yellow-400"
      };
    }

    return {
      texto: "Senha fraca",
      largura: "w-1/3",
      corTexto: "text-red-400",
      corBg: "bg-red-400"
    };
  }

  const statusSenha = validarSenha(senha);

  async function criarUsuario() {
    if (!nome || !email || !cpf || !senha || !cargo) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const payload = {
      nome,
      email,
      cpf,
      senha,
      cargo
    };

    try {
      const res = await fetch("http://localhost:8080/api/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const erro = await res.text();
        console.log("Erro da API:", erro);
        alert(`Erro ao criar usuário: ${erro}`);
        return;
      }

      await res.json();
      fecharModal();
    } catch (err) {
      console.log("Erro de conexão:", err);
      alert("Erro ao conectar no backend.");
    }
  }

  return (
    <div
      onClick={fecharModal}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-5 z-[999]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          w-full max-w-[520px] rounded-[32px] border p-8 shadow-2xl
          transition-all duration-300
          ${temaClaro ? "bg-white border-zinc-200" : "bg-[#0b0b0b] border-zinc-800"}
        `}
      >
        <h2 className="text-2xl font-semibold mb-6">Novo usuário</h2>

        <div className="flex flex-col gap-4">

          <input
            placeholder="Nome completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className={`h-12 px-4 rounded-xl ${
              temaClaro ? "bg-zinc-100 text-black" : "bg-[#101010] text-white"
            }`}
          />

          <input
            placeholder="E-mail institucional"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`h-12 px-4 rounded-xl ${
              temaClaro ? "bg-zinc-100 text-black" : "bg-[#101010] text-white"
            }`}
          />

          <input
            placeholder="CPF"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            className={`h-12 px-4 rounded-xl ${
              temaClaro ? "bg-zinc-100 text-black" : "bg-[#101010] text-white"
            }`}
          />

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className={`h-12 px-4 rounded-xl ${
              temaClaro ? "bg-zinc-100 text-black" : "bg-[#101010] text-white"
            }`}
          />

          {/* senha status */}
          <div>
            <div className={`w-full h-[6px] rounded-full overflow-hidden ${
              temaClaro ? "bg-zinc-300" : "bg-zinc-800"
            }`}>
              <div
                className={`h-full transition-all duration-300 ${statusSenha.largura} ${statusSenha.corBg}`}
              />
            </div>

            <p className={`text-xs mt-2 ${statusSenha.corTexto}`}>
              {statusSenha.texto}
            </p>
          </div>

          {/* 🔥 CARGO SEM ADMIN */}
          <select
            value={cargo}
            onChange={(e) => setCargo(e.target.value)}
            className={`h-12 px-4 rounded-xl ${
              temaClaro ? "bg-zinc-100 text-black" : "bg-[#101010] text-white"
            }`}
          >
            <option value="">Selecione o cargo</option>
            <option value="PADRAO">Padrão</option>
          </select>

          <button
            onClick={criarUsuario}
            className="h-12 rounded-xl bg-sky-400 text-black font-medium hover:opacity-90 transition"
          >
            Criar usuário
          </button>

        </div>
      </div>
    </div>
  );
}