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
        corTexto: "text-emerald-400",
        corBg: "bg-emerald-400"
      };
    }

    if (pontos >= 2) {
      return {
        texto: "Senha média",
        largura: "w-2/3",
        corTexto: "text-amber-400",
        corBg: "bg-amber-400"
      };
    }

    return {
      texto: "Senha fraca",
      largura: "w-1/3",
      corTexto: "text-rose-400",
      corBg: "bg-rose-400"
    };
  }

  const statusSenha = validarSenha(senha);

  function limparCPF(valor) {
    return valor.replace(/\D/g, "");
  }

  async function criarUsuario() {
    if (!nome || !email || !cpf || !senha || !cargo) {
      alert("Preencha todos os campos.");
      return;
    }

    const payload = {
      nome,
      email,
      cpf: limparCPF(cpf),
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
        alert(`Erro ao criar usuário: ${erro}`);
        return;
      }

      await res.json();

      setNome("");
      setEmail("");
      setCpf("");
      setSenha("");
      setCargo("");

      fecharModal();
    } catch (err) {
      alert("Erro ao conectar no backend.");
    }
  }

  return (
    <div
      onClick={fecharModal}
      className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-5 z-[999]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          w-full max-w-[520px] rounded-3xl border p-8 shadow-2xl
          ${temaClaro ? "bg-white border-zinc-200" : "bg-[#0b0b0b] border-zinc-800"}
        `}
      >
        <h2 className="text-2xl font-semibold mb-6">Novo usuário</h2>

        <div className="flex flex-col gap-4">

          <input
            placeholder="Nome completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className={`h-12 px-4 rounded-xl outline-none ${temaClaro ? "bg-zinc-100 text-black" : "bg-[#101010] text-white"}`}
          />

          <input
            placeholder="E-mail institucional"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`h-12 px-4 rounded-xl outline-none ${temaClaro ? "bg-zinc-100 text-black" : "bg-[#101010] text-white"}`}
          />

          <input
            placeholder="CPF"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            className={`h-12 px-4 rounded-xl outline-none ${temaClaro ? "bg-zinc-100 text-black" : "bg-[#101010] text-white"}`}
          />

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className={`h-12 px-4 rounded-xl outline-none ${temaClaro ? "bg-zinc-100 text-black" : "bg-[#101010] text-white"}`}
          />

          <div>
            <div className={`w-full h-2 rounded-full overflow-hidden ${temaClaro ? "bg-zinc-200" : "bg-zinc-800"}`}>
              <div className={`h-full transition-all ${statusSenha.largura} ${statusSenha.corBg}`} />
            </div>
            <p className={`text-xs mt-2 ${statusSenha.corTexto}`}>
              {statusSenha.texto}
            </p>
          </div>

          <select
            value={cargo}
            onChange={(e) => setCargo(e.target.value)}
            className={`h-12 px-4 rounded-xl outline-none ${temaClaro ? "bg-zinc-100 text-black" : "bg-[#101010] text-white"}`}
          >
            <option value="">Selecione o cargo</option>
            <option value="PERITO">Perito</option>
            <option value="DELEGADO">Delegado</option>
            <option value="AUDITOR">Auditor</option>
          </select>

          <button
            onClick={criarUsuario}
            className="h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            Criar usuário
          </button>

        </div>
      </div>
    </div>
  );
}