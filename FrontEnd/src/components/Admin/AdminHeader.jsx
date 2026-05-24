import { LogOut, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Header({
  temaClaro,
  setTemaClaro,
  usuario,
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
    w-[40px] h-[40px]
    rounded-[10px]
    border
    flex items-center justify-center
    transition-all
  `;

  const btnTheme = temaClaro
    ? "bg-white border-zinc-300 text-zinc-700 hover:bg-zinc-100"
    : "bg-[#0b0b0b] border-zinc-700 text-zinc-300 hover:bg-zinc-900";

  return (
    <header className="flex items-center justify-between flex-wrap gap-4 mb-6 w-full">

      {/* ESQUERDA (LOGO + USER) */}
      <div className="flex items-center gap-4">

        {/* LOGO */}
        <img
         
        />

      

      </div>

      {/* DIREITA (BOTÕES) */}
      <div className="flex items-center gap-2">

        {/* idioma */}
        <button
          onClick={toggleIdioma}
          className={`${btnBase} ${btnTheme} text-[12px] font-semibold`}
        >
          {idioma.toUpperCase()}
        </button>

        {/* tema */}
        <button
          onClick={() => setTemaClaro(!temaClaro)}
          className={`${btnBase} ${btnTheme}`}
        >
          {temaClaro ? <Moon size={15} /> : <Sun size={15} />}
        </button>

        {/* logout */}
        <button
          onClick={logout}
          className={`${btnBase} ${btnTheme} hover:text-red-400`}
        >
          <LogOut size={15} />
        </button>

      </div>
    </header>
  );
}