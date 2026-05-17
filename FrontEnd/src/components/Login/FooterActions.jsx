import { Moon, Sun } from "lucide-react";

export default function FooterActions({
  idioma,
  trocarIdioma,
  trocarTema,
  temaClaro
}){

  return(

    <div className="flex items-center gap-3">

      <button
        onClick={trocarIdioma}
        className={`
          h-8
          px-4
          rounded-full
          border
          text-sm
          transition-all
          duration-300

          ${
            temaClaro
            ? "border-zinc-300 text-zinc-700 hover:border-sky-400 hover:text-sky-400"
            : "border-zinc-700 text-zinc-300 hover:border-sky-400 hover:text-sky-400"
          }
        `}
      >

        {
          idioma === "pt"
          ? "EN"
          : "PT"
        }

      </button>

      <button
        onClick={trocarTema}
        className={`
          w-8
          h-8
          rounded-full
          border
          flex
          items-center
          justify-center
          transition-all
          duration-300

          ${
            temaClaro
            ? "border-zinc-300 text-zinc-700 hover:border-sky-400 hover:text-sky-400"
            : "border-zinc-700 text-zinc-300 hover:border-sky-400 hover:text-sky-400"
          }
        `}
      >

        {
          temaClaro
          ? <Moon size={16} />
          : <Sun size={16} />
        }

      </button>

    </div>

  );

}