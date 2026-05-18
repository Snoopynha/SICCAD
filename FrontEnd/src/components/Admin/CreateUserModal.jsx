import { useState } from "react";

export default function CreateUserModal({ temaClaro, fecharModal }) {
  const [senha, setSenha] = useState("");
  const [cpf, setCpf] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cargo, setCargo] = useState("DELEGADO");

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
    if (!nome || !email || !cpf || !senha) {
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
      // Rota relativa controlada pelo Proxy do Vite
      const res = await fetch("/api/usuarios", {
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

      const data = await res.json();
      console.log("Usuário criado com sucesso:", data);

      fecharModal(); 

    } catch (err) {
      console.log("Erro de conexão:", err);
      alert("Não foi possível conectar ao servidor backend.");
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
          relative z-[1000]
          w-full max-w-[520px]
          rounded-[32px] border p-8 shadow-2xl
          transition-all duration-300
          ${temaClaro ? "bg-white/95 border-zinc-200" : "bg-[#0b0b0b]/95 border-zinc-800"}
        `}
      >
        <div className="flex items-center justify-between mb-7">
          <h2 className="text-2xl font-semibold">Novo usuário</h2>

          <button
            type="button"
            onClick={fecharModal}
            className={`
              w-10 h-10 rounded-full border flex items-center justify-center transition
              ${temaClaro ? "border-zinc-300 hover:text-sky-400" : "border-zinc-800 hover:text-sky-400"}
            `}
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-5">
          <input
            type="text"
            placeholder="Nome completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className={`w-full h-14 rounded-2xl px-4 ${
              temaClaro ? "bg-zinc-100 text-black" : "bg-[#101010] text-white"
            }`}
          />

          <input
            type="email"
            placeholder="E-mail institucional"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full h-14 rounded-2xl px-4 ${
              temaClaro ? "bg-zinc-100 text-black" : "bg-[#101010] text-white"
            }`}
          />

          <input
            type="text"
            placeholder="CPF"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            className={`w-full h-14 rounded-2xl px-4 ${
              temaClaro ? "bg-zinc-100 text-black" : "bg-[#101010] text-white"
            }`}
          />

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className={`w-full h-14 rounded-2xl px-4 ${
              temaClaro ? "bg-zinc-100 text-black" : "bg-[#101010] text-white"
            }`}
          />

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

          <select
            value={cargo}
            onChange={(e) => setCargo(e.target.value)}
            className={`w-full h-14 rounded-2xl px-4 ${
              temaClaro ? "bg-zinc-100 text-black" : "bg-[#101010] text-white"
            }`}
          >
            <option value="DELEGADO">Delegado</option>
            <option value="PERITO">Perito</option>
          </select>

          <div className={`
            rounded-2xl p-4 text-sm
            ${temaClaro
              ? "bg-red-100 border border-red-200 text-red-500"
              : "bg-red-500/10 border border-red-500/20 text-red-400"
            }
          `}>
            Não é permitido cadastrar administradores pela interface.
          </div>

          <button
            type="button"
            onClick={criarUsuario}
            className="w-full h-14 rounded-2xl bg-sky-400 text-black font-medium hover:opacity-90 transition"
          >
            Criar usuário
          </button>
        </div>
      </div>
    </div>
  );
}