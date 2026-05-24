import { useState, useEffect, useMemo } from "react";
import AdminHeader from "../components/Admin/AdminHeader";
import FiltersBar from "../components/Admin/FiltersBar";
import UsersList from "../components/Admin/UsersList";
import CreateUserModal from "../components/Admin/CreateUserModal";
import DetailsModal from "../components/Admin/DetailsModal";

export default function AdminPage() {
  const [temaClaro, setTemaClaro] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [idioma, setIdioma] = useState("PT");
  const [usuarios, setUsuarios] = useState([]);
  const [casos, setCasos] = useState([]);
  const [busca, setBusca] = useState("");
  const [filtroCargo, setFiltroCargo] = useState("TODOS");
  const [detalhe, setDetalhe] = useState(null);

  async function carregarUsuarios() {
    try {
      const res = await fetch("http://localhost:8080/api/usuarios");
      const data = await res.json();
      setUsuarios(Array.isArray(data) ? data : []);
    } catch {
      setUsuarios([]);
    }
  }

  async function carregarCasos() {
    try {
      const res = await fetch("http://localhost:8080/api/casos");
      const data = await res.json();
      setCasos(Array.isArray(data) ? data : []);
    } catch {
      setCasos([]);
    }
  }

  useEffect(() => {
    carregarUsuarios();
    carregarCasos();
  }, []);

  function exportarUsuarios() {
    const blob = new Blob([JSON.stringify(usuarios || [], null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "usuarios.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  const usuariosComCasos = useMemo(() => {
    const mapa = {};

    casos.forEach((caso) => {
      caso.participantes?.forEach((p) => {
        const id = p.idUsuario;

        if (!mapa[id]) mapa[id] = [];

        mapa[id].push({
          id: caso.id,
          status: caso.status,
          titulo: caso.titulo || `Caso #${caso.id}`,
        });
      });
    });

    return usuarios.map((u) => ({
      ...u,
      casos: mapa[u.id] || [],
    }));
  }, [usuarios, casos]);

  const usuariosFiltrados = usuariosComCasos.filter((u) => {
    const termo = busca?.toLowerCase() || "";

    const matchCargo =
      filtroCargo === "TODOS" || u.cargo === filtroCargo;

    const matchBusca =
      !termo ||
      u.nome?.toLowerCase().includes(termo) ||
      u.email?.toLowerCase().includes(termo);

    return matchCargo && matchBusca;
  });

  return (
    <div
      className={`min-h-screen w-full transition ${temaClaro ? "bg-[#f4f6fb] text-black" : "bg-[#050505] text-white"
        }`}
    >
      <div className="max-w-[1250px] mx-auto px-6 py-6">

        <AdminHeader
          temaClaro={temaClaro}
          setTemaClaro={setTemaClaro}
          idioma={idioma}
          setIdioma={setIdioma}
        />

        <div className="mb-6 flex justify-between items-center mt-5">


          <div className="flex gap-3 ms-auto mt-10">
            <button
              onClick={exportarUsuarios}
              className="h-11 px-6 rounded-2xl border"

            >
              Exportar
            </button>

            <button
              onClick={() => setModalAberto(true)}
              className="h-11 px-6 rounded-2xl border"
            >
              Novo usuário
            </button>
          </div>
        </div>

        <div className="rounded-3xl border p-5 bg-[#0b0b0b] border-zinc-800">

          <FiltersBar
            idioma={idioma}
            view="usuarios"
            setFiltroCargo={setFiltroCargo}
            filtroCargo={filtroCargo}
            busca={busca}
            setBusca={setBusca}
            temaClaro={temaClaro}
          />

          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <UsersList
              usuarios={usuariosFiltrados}
              temaClaro={temaClaro}
              idioma={idioma}
              onClick={(u) => setDetalhe(u)}
            />
          </div>

        </div>
      </div>

      {modalAberto && (
        <CreateUserModal
          temaClaro={temaClaro}
          idioma={idioma}
          fecharModal={() => {
            setModalAberto(false);
            carregarUsuarios();
          }}
        />
      )}

      {detalhe && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999]">
          <DetailsModal
            data={detalhe}
            tipo="usuario"
            fechar={() => setDetalhe(null)}
          />
        </div>
      )}
    </div>
  );
}