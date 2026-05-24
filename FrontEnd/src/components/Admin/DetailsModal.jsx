export default function DetailsModal({ data, tipo, fechar }) {
  return (
    <div
      onClick={fechar}
      className="fixed inset-0 bg-black/60 flex items-center justify-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#111] p-6 rounded-2xl w-[500px]"
      >
        {tipo === "usuario" ? (
          <>
            <h2 className="text-xl font-bold">{data.nome}</h2>
            <p className="text-sm">{data.email}</p>

            <div className="mt-4">
              <b>Casos vinculados:</b>
              <ul className="text-sm mt-2">
                {data.casos?.map((c) => (
                  <li key={c.id}>• Caso #{c.id}</li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold">
              Caso #{data.id}
            </h2>

            <p className="text-sm mt-2">
              Status: {data.status}
            </p>

            <div className="mt-4">
              <b>Participantes:</b>
              <ul className="text-sm mt-2">
                {data.participantes?.map((p) => (
                  <li key={p.id}>• {p.nome}</li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}