import { useState } from "react";

import LoginIcon from "../components/Login/LoginIcon";
import EmailStep from "../components/Login/EmailStep";
import PasswordStep from "../components/Login/PasswordStep";
import FooterActions from "../components/Login/FooterActions";

export default function Login(){

  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [erroEmail, setErroEmail] = useState("");
  const [erroSenha, setErroSenha] = useState("");

  const [loading, setLoading] = useState(false);

  const [idioma, setIdioma] = useState("pt");

  const [temaClaro, setTemaClaro] = useState(false);

  function validarEmail(valor){

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regex.test(valor);

  }

  function avancar(){

    if(validarEmail(email)){

      setErroEmail("");
      setMostrarSenha(true);

    }
    else{

      setErroEmail("Digite um e-mail válido.");

    }

  }

  function voltar(){

    setMostrarSenha(false);

    setSenha("");

    setErroSenha("");

  }

  async function autenticar(){

    setErroSenha("");

    if(senha.trim() === ""){

      setErroSenha("Digite sua senha.");

      return;

    }

    setLoading(true);

    try{

      setTimeout(() => {

        setLoading(false);

        setErroSenha("Backend ainda não conectado.");

      }, 1000);

    }
    catch{

      setLoading(false);

      setErroSenha("Credenciais inválidas.");

    }

  }

  function trocarIdioma(){

    if(idioma === "pt"){

      setIdioma("en");

    }
    else{

      setIdioma("pt");

    }

  }

  function trocarTema(){

    setTemaClaro(!temaClaro);

  }

  return(

  <div
    className={`
      w-full
      min-h-screen
      flex
      flex-col
      items-center
      justify-between
      px-6
      py-5
      transition-all
      duration-300

      ${
        temaClaro
        ? "bg-[#f5f7fb] text-black"
        : "bg-[#050505] text-white"
      }
    `}
  >

    <div></div>

    <div className="w-full max-w-[420px] flex flex-col items-center gap-7">

      <LoginIcon temaClaro={temaClaro} />

      <div className="text-center">

        <h1 className="text-4xl font-semibold tracking-tight">

          {
            idioma === "pt"
            ? "Seja Bem-Vindo(a)!"
            : "Welcome"
          }

        </h1>

        <p
          className={`
            mt-3
            text-sm

            ${
              temaClaro
              ? "text-zinc-500"
              : "text-zinc-400"
            }
          `}
        >

          {
            idioma === "pt"
            ? "Insira suas credenciais para acessar sua conta."
            : "Enter your credentials to access your account."
          }

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

      {
        mostrarSenha && (

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

        )
      }

      <a
        href="#"
        className="
          text-sky-400
          text-sm
          font-bold
          hover:opacity-80
          transition
        "
      >

        {
          idioma === "pt"
          ? "ESQUECI A SENHA"
          : "FORGOT PASSWORD"
        }

      </a>

    </div>

    <div className="w-full flex flex-col items-center gap-5">

      <div
        className={`
          w-[85%]
          h-[1px]

          ${
            temaClaro
            ? "bg-zinc-300"
            : "bg-zinc-800"
          }
        `}
      ></div>

      <FooterActions
        idioma={idioma}
        trocarIdioma={trocarIdioma}
        trocarTema={trocarTema}
        temaClaro={temaClaro}
      />

    </div>

  </div>

);

}