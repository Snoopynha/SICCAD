import { LogOut, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Header({
  temaClaro,
  setTemaClaro,
  usuario,
  abrirModalUsuario,
}) {
  const navigate = useNavigate();
  const [idioma, setIdioma] = useState("pt");

  function toggleIdioma() {
    setIdioma((prev) => (prev === "pt" ? "en" : "pt"));
  }

  function logout() {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    navigate("/");
  }

  const btnBase = `
    h-[40px]
    rounded-[10px]
    border
    flex items-center justify-center
    transition-all
  `;

  const btnTheme = temaClaro
    ? "bg-white border-zinc-300 text-zinc-700 hover:bg-zinc-100"
    : "bg-[#0b0b0b] border-zinc-700 text-zinc-300 hover:bg-zinc-900";

  return (
    <header className="flex items-center justify-end gap-2 mb-6 w-full">

     <button
  onClick={abrirModalUsuario}
  className="
    h-[40px]
    px-4
    rounded-[10px]
    flex items-center justify-center
    font-medium
    text-white
    bg-blue-600
    hover:bg-blue-700
    transition-all
    shadow-lg shadow-blue-950/30
  "
>
  + Novo Usuário
</button>

      <button
        onClick={toggleIdioma}
        className={`${btnBase} w-[40px] ${btnTheme} text-[12px] font-semibold`}
      >
        {idioma.toUpperCase()}
      </button>

      <button
        onClick={() => setTemaClaro(!temaClaro)}
        className={`${btnBase} w-[40px] ${btnTheme}`}
      >
        {temaClaro ? <Moon size={15} /> : <Sun size={15} />}
      </button>

      <button
        onClick={logout}
        className={`${btnBase} w-[40px] ${btnTheme} hover:text-red-400`}
      >
        <LogOut size={15} />
      </button>
      

    </header>
  );
}