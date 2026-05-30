import InputField from "./InputField";

export default function PasswordStep({
  senha,
  setSenha,
  autenticar,
  voltar,
  erroSenha,
  loading,
  idioma,
  temaClaro
}) {
  const isPT = idioma === "pt";

  return (
    <div className="w-full flex flex-col gap-5 animate-fade">

      <button
        onClick={voltar}
        className="text-sm text-zinc-400 hover:text-sky-400 transition w-max"
      >
        {isPT ? "← Voltar" : "← Back"}
      </button>

      <InputField
        type="password"
        value={senha}
        setValue={setSenha}
        onEnter={autenticar}
        temaClaro={temaClaro}
        placeholder={isPT ? "Senha" : "Password"}
      />

      {erroSenha && (
        <span className="text-red-400 text-sm">
          {erroSenha}
        </span>
      )}

      {loading && (
        <span className="text-sky-400 text-sm">
          {isPT ? "Autenticando..." : "Authenticating..."}
        </span>
      )}

      <button
        onClick={autenticar}
        className="w-full h-12 rounded-full bg-sky-500 text-black font-bold hover:opacity-90 transition"
      >
        {isPT ? "ENTRAR" : "LOGIN"}
      </button>

    </div>
  );
}