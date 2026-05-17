const coresAvatar = [
  "bg-sky-500",
  "bg-emerald-500",
  "bg-violet-500",
  "bg-rose-500",
  "bg-amber-500",
  "bg-indigo-500",
  "bg-cyan-500"
];

function gerarCor(nome) {
  let soma = 0;

  for (let i = 0; i < nome.length; i++) {
    soma += nome.charCodeAt(i);
  }

  return coresAvatar[soma % coresAvatar.length];
}

export default function UsersList({ usuarios }) {

  return (

    <div className="flex flex-col gap-[14px]">

      {usuarios.map(usuario => {

        const cor = gerarCor(usuario.nome);

        return (

          <div
            key={usuario.id}
            className="
              border border-zinc-800
              rounded-[22px]
              p-[18px]
              flex items-center justify-between
              hover:border-sky-400 transition
              cursor-pointer
            "
          >

            {/* LEFT */}
            <div className="flex items-center gap-[14px]">

              {/* AVATAR */}
              <div className={`
                w-[48px] h-[48px] rounded-full
                flex items-center justify-center
                font-bold text-white
                ${cor}
              `}>
                {usuario.nome
                  .split(" ")
                  .map(n => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </div>

              {/* INFO */}
              <div>

                <div className="text-[15px] font-semibold">
                  {usuario.nome}
                </div>

                <div className="text-[13px] text-zinc-400">
                  {usuario.email}
                </div>

              </div>

            </div>

            {/* CARGO FLAG */}
            <div className={`
              text-[11px]
              px-3 py-[4px]
              rounded-full
              border font-medium

              ${usuario.cargo === "DELEGADO"
                ? "bg-sky-400/10 text-sky-400 border-sky-400/20"
                : "bg-violet-400/10 text-violet-300 border-violet-400/20"
              }
            `}>
              {usuario.cargo}
            </div>

          </div>

        );
      })}

    </div>

  );
}