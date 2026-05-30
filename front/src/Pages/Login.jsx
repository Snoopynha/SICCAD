import { useState } from "react";
import LoginIcon from "../components/Login/LoginIcon";
import EmailStep from "../components/Login/EmailStep";
import PasswordStep from "../components/Login/PasswordStep";
import FooterActions from "../components/Login/FooterActions";

export default function Login() {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erroEmail, setErroEmail] = useState("");
  const [erroSenha, setErroSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [idioma, setIdioma] = useState("pt");
  const [temaClaro, setTemaClaro] = useState(false);

  const [recuperacaoAberta, setRecuperacaoAberta] = useState(false);

  function validarEmail(valor) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
  }

  function avancar() {
    if (!validarEmail(email)) {
      setErroEmail("Digite um e-mail válido.");
      return;
    }

    setErroEmail("");
    setMostrarSenha(true);
  }

  function voltar() {
    setMostrarSenha(false);
    setSenha("");
    setErroSenha("");
  }

  async function autenticar() {
    setErroSenha("");

    if (!validarEmail(email)) {
      setErroEmail("E-mail inválido.");
      return;
    }

    if (senha.trim() === "") {
      setErroSenha("Digite sua senha.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/usuarios/autenticar",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, senha }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErroSenha(data?.message || "Falha na autenticação.");
        setLoading(false);
        return;
      }

      localStorage.setItem("usuario", JSON.stringify(data));

      setLoading(false);

      window.location.href =
        data?.tipo_global === "ADMIN" ? "/admin" : "/dashboard";

    } catch {
      setLoading(false);
      setErroSenha("Erro ao conectar com o servidor.");
    }
  }

  return (
    <div className={`w-full min-h-screen flex flex-col items-center justify-between px-6 py-5
      ${temaClaro ? "bg-[#f5f7fb] text-black" : "bg-[#050505] text-white"}`}>

      <div />

      <div className="w-full max-w-[420px] flex flex-col items-center gap-7 relative">

        <LoginIcon temaClaro={temaClaro} />

        <div className="text-center">
          <h1 className="text-4xl font-semibold">
            {idioma === "pt" ? "Seja Bem-Vindo(a)!" : "Welcome"}
          </h1>

          <p className="text-sm mt-3 text-zinc-400">
            {idioma === "pt"
              ? "Insira suas credenciais para acessar sua conta."
              : "Enter your credentials to access your account."}
          </p>
        </div>

        <EmailStep
          email={email}
          setEmail={setEmail}
          avancar={avancar}
          erroEmail={erroEmail}
          mostrarSenha={mostrarSenha}
          idioma={idioma}
          temaClaro={temaClaro}
        />

        {mostrarSenha && (
          <PasswordStep
            senha={senha}
            setSenha={setSenha}
            autenticar={autenticar}
            voltar={voltar}
            erroSenha={erroSenha}
            loading={loading}
            idioma={idioma}
            temaClaro={temaClaro}
          />
        )}

        {/* BOTÃO + POPOVER */}
        <div className="relative w-full flex justify-center">

          <button
            onClick={() => setRecuperacaoAberta((v) => !v)}
            className="text-sky-400 text-sm font-bold hover:opacity-80 transition"
          >
            {idioma === "pt" ? "ESQUECI A SENHA" : "FORGOT PASSWORD"}
          </button>

          {recuperacaoAberta && (
            <div
              className={`
                absolute bottom-full mb-3 w-[260px] p-4 rounded-xl border shadow-lg
                animate-fade
                ${temaClaro
                  ? "bg-white border-zinc-200 text-black"
                  : "bg-[#0a0a0a] border-zinc-800 text-white"}
              `}
            >

              {/* SETINHA */}
              <div
                className={`
                  absolute left-1/2 -translate-x-1/2 -bottom-2
                  w-4 h-4 rotate-45 border
                  ${temaClaro
                    ? "bg-white border-zinc-200"
                    : "bg-[#0a0a0a] border-zinc-800"}
                `}
              />

              <p className="text-xs text-zinc-400 leading-relaxed">
                {idioma === "pt"
                  ? "Para recuperar sua senha, entre em contato com o administrador do sistema."
                  : "To recover your password, contact the system administrator."}
              </p>

              <button
                onClick={() => setRecuperacaoAberta(false)}
                className="mt-3 w-full h-9 rounded-md bg-sky-500 text-black text-sm font-semibold hover:opacity-90 transition"
              >
                OK
              </button>

            </div>
          )}

        </div>

      </div>

      <FooterActions
        idioma={idioma}
        trocarIdioma={() => setIdioma((p) => (p === "pt" ? "en" : "pt"))}
        trocarTema={() => setTemaClaro((p) => !p)}
        temaClaro={temaClaro}
      />
    </div>
  );
}