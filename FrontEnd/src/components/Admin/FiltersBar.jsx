export default function FiltersBar({ abrirModal }) {
  return (

    <div className="flex items-center justify-between gap-4 flex-wrap">

      {/* FILTROS */}
      <div className="flex gap-3 flex-wrap">

        <button className="
          h-10 px-4 rounded-full border text-sm transition

          border-zinc-800 hover:border-sky-400 hover:text-sky-400
        ">
          Ordem A-Z
        </button>

        <button className="
          h-10 px-4 rounded-full border text-sm transition

          border-zinc-800 hover:border-sky-400 hover:text-sky-400
        ">
          Delegados
        </button>

        <button className="
          h-10 px-4 rounded-full border text-sm transition

          border-zinc-800 hover:border-sky-400 hover:text-sky-400
        ">
          Peritos
        </button>

      </div>

      {/* BOTÃO */}
      <button
        onClick={abrirModal}
        className="
          h-10 px-5 rounded-full
          bg-sky-400 hover:bg-sky-300
          text-black font-medium
          transition
        "
      >
        Novo usuário
      </button>

    </div>
  );
}