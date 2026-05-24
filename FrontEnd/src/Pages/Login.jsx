import { useState } from "react";
import { useNavigate } from "react-router-dom";

import LoginIcon from "../components/Login/LoginIcon";
import EmailStep from "../components/Login/EmailStep";
import PasswordStep from "../components/Login/PasswordStep";
import FooterActions from "../components/Login/FooterActions";

export default function Login() {
  const navigate = useNavigate();
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erroEmail, setErroEmail] = useState("");
  const [erroSenha, setErroSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [idioma, setIdioma] = useState("pt");
  const [temaClaro, setTemaClaro] = useState(false);

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
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, senha }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErroSenha(data?.message || "Falha na autenticação.");
        setLoading(false);
        return;
      }

      const usuario = data;

      console.log("LOGIN OK:", usuario);

      localStorage.setItem("usuario", JSON.stringify(usuario));

      setLoading(false);

      window.location.href =
        usuario?.tipo_global === "ADMIN"
          ? "/admin"
          : "/dashboard";

    } catch (error) {
      setLoading(false);
      setErroSenha("Erro ao conectar com o servidor.");
      console.error(error);
    }
  }
  return (
    <div
      className={`w-full min-h-screen flex flex-col items-center justify-between px-6 py-5
      ${temaClaro ? "bg-[#f5f7fb] text-black" : "bg-[#050505] text-white"}`}
    >
      <div />

      <div className="w-full max-w-[420px] flex flex-col items-center gap-7">
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

        <a className="text-sky-400 text-sm font-bold">
          {idioma === "pt" ? "ESQUECI A SENHA" : "FORGOT PASSWORD"}
        </a>
      </div>

      <FooterActions
        idioma={idioma}
        trocarIdioma={() =>
          setIdioma((prev) => (prev === "pt" ? "en" : "pt"))
        }
        trocarTema={() => setTemaClaro((prev) => !prev)}
        temaClaro={temaClaro}
      />
    </div>
  );
}