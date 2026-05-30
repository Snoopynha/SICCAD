function corCargo(cargo) {
  switch (cargo?.toUpperCase()) {
    case "DELEGADO":
      return "bg-blue-500/10 text-blue-400 border-blue-500/30";

    case "PERITO":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";

    case "AUDITOR":
      return "text-violet-300 bg-violet-500/10 border-violet-500/20";

    default:
      return "bg-zinc-500/10 text-zinc-400 border-zinc-500/30";
  }
}

function formatarCargo(cargo) {
  if (!cargo) return "";

  return cargo.charAt(0).toUpperCase() +
    cargo.slice(1).toLowerCase();
}

export default function UsersList({
  usuarios,
  temaClaro,
  idioma,
  onClick,
}) {
  return (
    <>
      {usuarios.map((u) => (
        <div
          key={u.id}
          onClick={() => onClick(u)}
          className={`
            cursor-pointer
            rounded-2xl
            border
            p-5
            transition-all
            duration-200
   

            ${
              temaClaro
                ? "bg-white border-zinc-200 hover:border-zinc-300"
                : "bg-[#101010] border-zinc-800 hover:border-zinc-700"
            }
          `}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h3
                    className={`font-semibold truncate ${
                      temaClaro ? "text-zinc-900" : "text-white"
                    }`}
                  >
                    {u.nome}
                  </h3>

                  <p className="text-sm text-zinc-500 truncate mt-1">
                    {u.email}
                  </p>
                </div>

                {u.cargo && (
                  <span
                    className={`
                      text-xs
                      px-3
                      py-1
                      rounded-full
                      border
                      font-medium
                      shrink-0
                      ${corCargo(u.cargo)}
                    `}
                  >
                    {formatarCargo(u.cargo)}
                  </span>
                )}
              </div>

              <div
                className={`mt-4 pt-3 flex items-center justify-between ${
                  temaClaro
                    ? "border-t border-zinc-200"
                    : "border-t border-zinc-800"
                }`}
              >
                <span className="text-xs text-zinc-500">
                  {idioma === "PT"
                    ? "Casos vinculados"
                    : "Assigned cases"}
                </span>

                <span
                  className={`text-sm font-medium ${
                    temaClaro ? "text-zinc-700" : "text-zinc-300"
                  }`}
                >
                  {u.casos?.length || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}