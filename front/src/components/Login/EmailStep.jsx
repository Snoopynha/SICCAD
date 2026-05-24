export default function EmailStep({
  email,
  setEmail,
  avancar,
  erroEmail,
  mostrarSenha,
  idioma,
  temaClaro
}){

  return(

    <div className="w-full flex flex-col gap-4">

      <div className="relative w-full">

        <input
          type="email"
          value={email}
          disabled={mostrarSenha}
          placeholder=" "
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => {

            if(e.key === "Enter"){

              avancar();

            }

          }}
          className={`
            peer
            w-full
            bg-transparent
            border-b
            outline-none
            pt-5
            pb-2
            text-[17px]
            transition-all
            duration-300

            autofill:bg-transparent

            [&:-webkit-autofill]:shadow-[0_0_0px_1000px_transparent_inset]
            [&:-webkit-autofill]:[-webkit-background-clip:text]

            ${
              temaClaro
              ? `
                border-zinc-300
                text-black
                focus:border-sky-400
                [&:-webkit-autofill]:[-webkit-text-fill-color:black]
              `
              : `
                border-zinc-700
                text-white
                focus:border-sky-400
                [&:-webkit-autofill]:[-webkit-text-fill-color:white]
              `
            }
          `}
        />

        <label
          className={`
            absolute
            left-0
            pointer-events-none
            transition-all
            duration-200

            peer-placeholder-shown:top-5
            peer-placeholder-shown:text-sm

            peer-focus:-top-1
            peer-focus:text-xs

            peer-not-placeholder-shown:-top-1
            peer-not-placeholder-shown:text-xs

            ${
              temaClaro
              ? "text-zinc-500 peer-focus:text-sky-400"
              : "text-zinc-400 peer-focus:text-sky-400"
            }
          `}
        >

          {
            idioma === "pt"
            ? "E-mail institucional"
            : "Institutional email"
          }

        </label>

      </div>

      {
        erroEmail && (

          <span className="text-red-400 text-sm">

            {erroEmail}

          </span>

        )
      }

      {
        !mostrarSenha && (

          <button
            onClick={avancar}
            className={`
              w-full
              h-13
              rounded-full
              border
              font-bold
              text-sm
              transition-all
              duration-300

              ${
                temaClaro
                ? `
                  bg-white
                  border-zinc-300
                  text-black
                  hover:bg-sky-400
                `
                : `
                  bg-[#0c0c0c]
                  border-zinc-800
                  text-white
                  hover:bg-sky-400
                  hover:text-black
                `
              }
            `}
          >

            {
              idioma === "pt"
              ? "PRÓXIMO"
              : "NEXT"
            }

          </button>

        )
      }

    </div>

  );

}