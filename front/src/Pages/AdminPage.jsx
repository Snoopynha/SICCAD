import { useState, useEffect, useMemo } from "react";
import AdminHeader from "../components/Admin/AdminHeader";
import FiltersBar from "../components/Admin/FiltersBar";
import UsersList from "../components/Admin/UsersList";
import CasesList from "../components/Admin/CasesList";
import CreateUserModal from "../components/Admin/CreateUserModal";
import DetailsModal from "../components/Admin/DetailsModal";
import CaseDetailsModal from "../components/Admin/CaseDetailsModal";

export default function AdminPage() {
  const usuarioStorage = JSON.parse(localStorage.getItem("usuario"));

  const [temaClaro, setTemaClaro] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [idioma, setIdioma] = useState("PT");

  const [usuarios, setUsuarios] = useState([]);
  const [casos, setCasos] = useState([]);

  const [busca, setBusca] = useState("");

  const [view, setView] = useState("usuarios");

  const [filtroCargo, setFiltroCargo] = useState("TODOS");
  const [filtroStatus, setFiltroStatus] = useState("TODOS");

  const [detalhe, setDetalhe] = useState(null);
  const [casoSelecionado, setCasoSelecionado] = useState(null);

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
      const res = await fetch("http://localhost:8080/api/casos", {
        headers: {
          "X-User-Id": usuarioStorage?.id,
        },
      });

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


  const usuariosComCasos = useMemo(() => {
    const mapa = {};

    casos.forEach((caso) => {
      (caso.usuarios || []).forEach((uc) => {
        const id = uc.id?.idUsuario;

        if (!id) return;

        if (!mapa[id]) mapa[id] = [];

        mapa[id].push({
          id: caso.id,
          status: caso.status,
          titulo: caso.titulo || "Sem título",
          papel: uc.papelNoCaso,
        });
      });
    });

    return usuarios
      .filter((u) => u.tipoGlobal !== "ADMIN")
      .map((u) => ({
        ...u,
        casos: mapa[u.id] || [],
      }));
  }, [usuarios, casos]);

  const usuariosFiltrados = usuariosComCasos.filter((u) => {
    const termo = busca.toLowerCase();

    const matchCargo =
      filtroCargo === "TODOS" ||
      u.cargo === filtroCargo;

    const matchBusca =
      !termo ||
      u.nome?.toLowerCase().includes(termo) ||
      u.email?.toLowerCase().includes(termo);

    return matchCargo && matchBusca;
  });

  const casosFiltrados = casos.filter((c) => {
    const termo = busca.toLowerCase();

    const matchBusca =
      !termo ||
      c.titulo?.toLowerCase().includes(termo) ||
      c.descricao?.toLowerCase().includes(termo);

    const matchStatus =
      filtroStatus === "TODOS" ||
      c.status === filtroStatus;

    return matchBusca && matchStatus;
  });

  return (
    <div
      className={`min-h-screen w-full transition ${
        temaClaro
          ? "bg-[#f4f6fb] text-black"
          : "bg-[#050505] text-white"
      }`}
    >
      <div className="max-w-[1250px] mx-auto px-6 py-6">

        <AdminHeader
          temaClaro={temaClaro}
          setTemaClaro={setTemaClaro}
          idioma={idioma}
          setIdioma={setIdioma}
          abrirModalUsuario={() => setModalAberto(true)}
        
        />
        

       <div
  className="
    flex
    justify-between
    items-center
    px-2
    py-2
    w-full
    rounded-t-3xl
    border border-zinc-800
    border-b-0
    bg-[#0b0b0b]
    -mb-[1px]
  "
>

  <button
    onClick={() => setView("usuarios")}
    className={`
      flex-1
      h-12
      rounded-2xl
      font-medium
      transition-all
      ${
        view === "usuarios"
          ? "bg-blue-600 text-white shadow-lg shadow-blue-950/40"
          : "text-zinc-500 hover:text-white hover:bg-zinc-900"
      }
    `}
  >
    Usuários
  </button>

  <div className="w-2" />

  <button
    onClick={() => setView("casos")}
    className={`
      flex-1
      h-12
      rounded-2xl
      font-medium
      transition-all
      ${
        view === "casos"
          ? "bg-blue-600 text-white shadow-lg shadow-blue-950/40"
          : "text-zinc-500 hover:text-white hover:bg-zinc-900"
      }
    `}
  >
    Casos
  </button>

</div>

        <div
  className="
    rounded-b-3xl
    border border-zinc-800
    bg-[#0b0b0b]
    overflow-hidden
    shadow-[0_20px_60px_rgba(0,0,0,0.35)]
  "
>

  <div
    className="
      px-6 py-5
      border-b border-zinc-800
    
    "
  >
    <FiltersBar
      idioma={idioma}
      view={view}
      busca={busca}
      setBusca={setBusca}
      filtroCargo={filtroCargo}
      setFiltroCargo={setFiltroCargo}
      filtroStatus={filtroStatus}
      setFiltroStatus={setFiltroStatus}
    />
  </div>

  <div className="p-6">

    <div className="flex items-center justify-between mb-5">
      <div>
        <h2 className="text-lg font-semibold text-white">
          {view === "usuarios"
            ? "Gerenciamento  Usuários"
            : "Gerenciamento de Casos"}
        </h2>

        <p className="text-sm text-zinc-500 mt-1">
          {view === "usuarios"
            ? `${usuariosFiltrados.length} usuários encontrados`
            : `${casosFiltrados.length} casos encontrados`}
        </p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

      {view === "usuarios" ? (
        <UsersList
          usuarios={usuariosFiltrados}
          temaClaro={temaClaro}
          idioma={idioma}
          onClick={(u) => setDetalhe(u)}
        />
      ) : (
        <CasesList
          casos={casosFiltrados}
          onClick={(caso) => setCasoSelecionado(caso)}
        />
      )}

    </div>

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

      {casoSelecionado && (
  <CaseDetailsModal
    caso={casoSelecionado}
    fechar={() => setCasoSelecionado(null)}
  />
)}
    </div>
  );
}