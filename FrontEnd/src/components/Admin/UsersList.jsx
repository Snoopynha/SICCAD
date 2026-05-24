const cores = [
  "bg-sky-500",
  "bg-cyan-500",
  "bg-indigo-500",
  "bg-violet-500",
  "bg-emerald-500",
  "bg-rose-500",
  "bg-amber-500"
];

function pegarCor(nome = "") {
  let soma = 0;
  for (let i = 0; i < nome.length; i++) {
    soma += nome.charCodeAt(i);
  }
  return cores[soma % cores.length];
}

function inicial(nome = "") {
  return nome.charAt(0).toUpperCase();
}

export default function UsersList({
  usuarios,
  temaClaro,
  idioma,
  onClick
}) {
  return (
    <>
      {usuarios.map((u) => (
        <div
          key={u.id}
          onClick={() => onClick(u)}
          className={`
            cursor-pointer rounded-2xl border p-4
            
            ${temaClaro
              ? "bg-white border-zinc-200"
              : "bg-[#0f0f0f] border-zinc-800"}
          `}
        >

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className={`
                w-10 h-10 rounded-full
                flex items-center justify-center
                text-white font-bold shadow-lg
                ${pegarCor(u.nome)}
              `}>
                {inicial(u.nome)}
              </div>

              <div>
                <div className="font-semibold">{u.nome}</div>
                <div className="text-xs text-zinc-400">{u.email}</div>
              </div>

            </div>

            <div className="
              text-xs px-3 py-1 rounded-full
              border border-zinc-700
              text-zinc-300
            ">
              {u.cargo}
            </div>

          </div>

          <div className="mt-3 text-xs text-zinc-400">
            {u.casos?.length || 0} {idioma === "PT" ? "casos" : "cases"}
          </div>

        </div>
      ))}
    </>
  );
}