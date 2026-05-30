import { useEffect, useState } from "react";

import Header from "../components/Dashboard/Header";
import FiltersBar from "../components/Dashboard/FiltersBar";
import CasesGrid from "../components/Dashboard/CasesGrid";
import DetailsPanel from "../components/Dashboard/DetailsPanel";

import NewCaseModal from "../components/Dashboard/Modals/NewCaseModal";
import ParticipantModal from "../components/Dashboard/Modals/ParticipantModal";
import EvidenceModal from "../components/Dashboard/Modals/EvidenceModal";

export default function Dashboard() {
  const usuarioStorage = JSON.parse(localStorage.getItem("usuario"));
  const [usuario, setUsuario] = useState(null);
  const [casos, setCasos] = useState([]);
  const [temaClaro, setTemaClaro] = useState(false);
  const [detalhesAberto, setDetalhesAberto] = useState(false);
  const [casoSelecionado, setCasoSelecionado] = useState(null);
  const [casoDetalhado, setCasoDetalhado] = useState(null);
  const [participantes, setParticipantes] = useState([]);
  const [evidencias, setEvidencias] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [novoCasoModal, setNovoCasoModal] = useState(false);
  const [participanteModal, setParticipanteModal] = useState(false);
  const [evidenciaModal, setEvidenciaModal] = useState(false);
  const [buscaUsuario, setBuscaUsuario] = useState("");
  const [papelSelecionado, setPapelSelecionado] = useState("DELEGADO");
  const [arquivo, setArquivo] = useState(null);
  const [busca, setBusca] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("");
  const [ordenacao, setOrdenacao] = useState("");
  const [notificacoes, setNotificacoes] = useState([]);
  const [notifAberto, setNotifAberto] = useState(false);
  const headers = {
    "X-User-Id": usuarioStorage?.id,
  };

  async function apiFetch(url, options = {}) {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...(options.headers || {}),
      },
    });
    if (!res.ok) {
      throw new Error("Erro na requisição");
    }
    return res;
  }

  useEffect(() => {
    async function carregarUsuario() {
      if (!usuarioStorage?.id) return;
      try {
        const res = await fetch(
          `http://localhost:8080/api/usuarios/${usuarioStorage.id}`
        );
        setUsuario(await res.json());
      } catch (err) {
        console.log(err);
      }
    }
    carregarUsuario();
  }, []);

  async function carregarCasos() {
    try {
      const res = await apiFetch("http://localhost:8080/api/casos");
      const data = await res.json();
      setCasos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (usuarioStorage?.id) carregarCasos();
  }, []);

  async function carregarHistoricoCustodia(idEvidencia) {
    try {
      const res = await apiFetch(
        `http://localhost:8080/api/evidencias/${idEvidencia}/custodia/historico`
      );
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  async function abrirDetalhes(idCaso) {
    try {
      const [casoData, participantesData, evidenciasData] = await Promise.all([
        apiFetch(`http://localhost:8080/api/casos/${idCaso}`).then((r) => r.json()),
        apiFetch(`http://localhost:8080/api/casos/${idCaso}/participantes`).then((r) => r.json()),
        apiFetch(`http://localhost:8080/api/casos/${idCaso}/evidencias`).then((r) => r.json()),
      ]);

      let historicoCompleto = [];
      historicoCompleto.push({
        tipoAcao: "CASO CRIADO",
        justificativa: `Caso criado em ${new Date(casoData.dataAbertura).toLocaleString("pt-BR")}`,
        dataEvento: casoData.dataAbertura,
      });

      if (Array.isArray(evidenciasData)) {
        for (const e of evidenciasData) {
          historicoCompleto.push({
            tipoAcao: "UPLOAD DE EVIDÊNCIA",
            justificativa: `${e.nomeOriginalArquivo || e.nomeArquivo} enviado para o caso`,
            dataEvento: e.dataUpload,
          });

          const historicoCustodia = await carregarHistoricoCustodia(e.id);
          if (Array.isArray(historicoCustodia)) {
            historicoCustodia.forEach((h) => {
              const tipo = h.acao || "";
              if (tipo === "COLETA") return;
              historicoCompleto.push({
                tipoAcao: tipo,
                descricaoAcao: h.descricaoAcao,
                justificativa: h.justificativa,
                dataEvento: h.dataHora,
                custodianteAnterior: h.custodianteAnterior,
                custodiantePosterior: h.custodiantePosterior,
                evidencia: e.nomeOriginalArquivo || e.nomeArquivo,
              });
            });
          }
        }
      }

      historicoCompleto.sort(
        (a, b) => new Date(b.dataEvento || 0) - new Date(a.dataEvento || 0)
      );

      setCasoSelecionado(idCaso);
      setCasoDetalhado(casoData);
      setParticipantes(Array.isArray(participantesData) ? participantesData : []);
      setEvidencias(Array.isArray(evidenciasData) ? evidenciasData : []);
      setHistorico(historicoCompleto);
      setDetalhesAberto(true);
    } catch (err) {
      console.log(err);
    }
  }

  function fecharTudo() {
    setDetalhesAberto(false);
    setCasoSelecionado(null);
    setCasoDetalhado(null);
    setParticipantes([]);
    setEvidencias([]);
    setHistorico([]);
  }

  function filtrarCasos(lista) {
    let result = [...lista];
    if (busca) {
      const b = busca.toLowerCase();
      result = result.filter(
        (c) =>
          c.titulo?.toLowerCase().includes(b) ||
          String(c.numeroProcesso || "").includes(busca) ||
          c.usuarios?.some((u) => u.nome?.toLowerCase().includes(b))
      );
    }
    if (statusFiltro) {
      result = result.filter((c) => c.status === statusFiltro);
    }
    if (ordenacao === "recentes") {
      result.sort((a, b) => new Date(b.dataAbertura) - new Date(a.dataAbertura));
    }
    if (ordenacao === "antigos") {
      result.sort((a, b) => new Date(a.dataAbertura) - new Date(b.dataAbertura));
    }
    return result;
  }

  const casosFiltrados = filtrarCasos(casos);

  async function alterarStatus(endpoint) {
    try {
      await apiFetch(
        `http://localhost:8080/api/casos/${casoSelecionado}/${endpoint}`,
        { method: "PATCH" }
      );
      await carregarCasos();
      await abrirDetalhes(casoSelecionado);
    } catch (err) {
      console.log(err);
    }
  }

  const iniciarPericia = () => alterarStatus("iniciar-pericia");
  const concluirCaso = () => alterarStatus("concluir");
  const arquivarCaso = () => alterarStatus("arquivar");
  const reabrirCaso = () => alterarStatus("reabrir");

  async function verificarIntegridade(idEvidencia) {
    try {
      const res = await apiFetch(
        `http://localhost:8080/api/casos/${casoSelecionado}/evidencias/${idEvidencia}/verificar-integridade`
      );
      const data = await res.json();
      setEvidencias((prev) =>
        prev.map((e) =>
          e.id === idEvidencia
            ? { ...e, resultadoIntegridade: data.integro ? "OK" : "ALTERADO" }
            : e
        )
      );
    } catch (err) {
      console.log(err);
    }
  }

  async function adicionarParticipante() {
    try {
      if (!buscaUsuario) return alert("Digite o email do usuário");
      const usuarios = await fetch("http://localhost:8080/api/usuarios").then((r) => r.json());
      const user = usuarios.find(
        (u) => u.email?.toLowerCase() === buscaUsuario.toLowerCase()
      );
      if (!user) return alert("Usuário não encontrado");
      await apiFetch(
        `http://localhost:8080/api/casos/${casoSelecionado}/participantes?idUsuario=${user.id}&papel=${papelSelecionado}`,
        { method: "POST" }
      );
      setBuscaUsuario("");
      setParticipanteModal(false);
      await abrirDetalhes(casoSelecionado);
      await carregarCasos();
    } catch (err) {
      console.log(err);
    }
  }

  async function removerParticipante(idUsuario) {
    try {
      if (!confirm("Deseja remover este participante?")) return;
      await apiFetch(
        `http://localhost:8080/api/casos/${casoSelecionado}/participantes/${idUsuario}`,
        { method: "DELETE" }
      );
      const novaLista = participantes.filter(
        (p) => Number(p.idUsuario) !== Number(idUsuario)
      );
      setParticipantes(novaLista);
      setCasos((prev) =>
        prev.map((c) =>
          Number(c.id) === Number(casoSelecionado)
            ? { ...c, usuarios: novaLista }
            : c
        )
      );
    } catch (err) {
      console.log(err);
    }
  }

  function formatarStatus(status) {
    switch (status) {
      case "ANDAMENTO": return "Em andamento";
      case "PERICIA": return "Perícia";
      case "CONCLUIDO": return "Concluído";
      case "ARQUIVADO": return "Arquivado";
      default: return status;
    }
  }

  async function transferirCustodia(idEvidencia, idDestino, justificativa) {
    try {
      if (!idDestino || !justificativa) return;
      await apiFetch(
        `http://localhost:8080/api/evidencias/${idEvidencia}/custodia/transferir?idDestino=${idDestino}`,
        {
          method: "POST",
          body: JSON.stringify({ justificativa }),
          headers: { ...headers, "Content-Type": "application/json" },
        }
      );
      await abrirDetalhes(casoSelecionado);
    } catch (err) {
      console.log(err);
    }
  }

  async function aceitarCustodia(idEvidencia) {
    try {
      await apiFetch(
        `http://localhost:8080/api/evidencias/${idEvidencia}/custodia/aceitar`,
        { method: "PATCH" }
      );
      await abrirDetalhes(casoSelecionado);
    } catch (err) {
      console.log(err);
    }
  }

  async function analisarCustodia(idEvidencia, justificativa) {
    try {
      if (!justificativa) return;
      await apiFetch(
        `http://localhost:8080/api/evidencias/${idEvidencia}/custodia/analisar`,
        {
          method: "POST",
          body: JSON.stringify({ justificativa }),
          headers: { ...headers, "Content-Type": "application/json" },
        }
      );
      await abrirDetalhes(casoSelecionado);
    } catch (err) {
      console.log(err);
    }
  }

  async function devolverCustodia(idEvidencia, justificativa) {
    try {
      if (!justificativa) return;
      await apiFetch(
        `http://localhost:8080/api/evidencias/${idEvidencia}/custodia/devolver`,
        {
          method: "POST",
          body: JSON.stringify({ justificativa }),
          headers: { ...headers, "Content-Type": "application/json" },
        }
      );
      await abrirDetalhes(casoSelecionado);
    } catch (err) {
      console.log(err);
    }
  }

  async function descartarCustodia(idEvidencia, justificativa) {
    try {
      if (!justificativa) return;
      await apiFetch(
        `http://localhost:8080/api/evidencias/${idEvidencia}/custodia/descartar`,
        {
          method: "POST",
          body: JSON.stringify({ justificativa }),
          headers: { ...headers, "Content-Type": "application/json" },
        }
      );
      await abrirDetalhes(casoSelecionado);
    } catch (err) {
      console.log(err);
    }
  }

  async function enviarEvidencia() {
    try {
      if (!arquivo) return alert("Selecione um arquivo");
      const formData = new FormData();
      formData.append("arquivo", arquivo);
      await apiFetch(
        `http://localhost:8080/api/casos/${casoSelecionado}/evidencias`,
        { method: "POST", body: formData }
      );
      await abrirDetalhes(casoSelecionado);
      setArquivo(null);
      setEvidenciaModal(false);
    } catch (err) {
      console.log(err);
    }
  }

  async function baixarArquivo(idEvidencia) {
    try {
      const blob = await apiFetch(
        `http://localhost:8080/api/casos/${casoSelecionado}/evidencias/${idEvidencia}/baixar`
      ).then((r) => r.blob());
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "evidencia";
      a.click();
    } catch (err) {
      console.log(err);
    }
  }

  async function carregarNotificacoes(idCaso) {
    try {
      const res = await apiFetch(
        `http://localhost:8080/api/notificacoes/caso/${idCaso}`
      );
      const data = await res.json();
      setNotificacoes(data.notificacoes || []);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (!casoSelecionado) return;
    carregarNotificacoes(casoSelecionado);
    const interval = setInterval(() => {
      carregarNotificacoes(casoSelecionado);
    }, 5000);
    return () => clearInterval(interval);
  }, [casoSelecionado]);

  return (
    <div
      className={`min-h-screen transition-all ${temaClaro ? "bg-[#f5f7fb] text-black" : "bg-[#050505] text-white"}`}
    >
      <div className="max-w-[1280px] mx-auto px-10 py-8">
        <Header
          temaClaro={temaClaro}
          setTemaClaro={setTemaClaro}
          abrirNovoCaso={() => setNovoCasoModal(true)}
          usuario={usuario}
          notificacoes={notificacoes}
          notifAberto={notifAberto}
          setNotifAberto={setNotifAberto}
        />

        <div className="mt-10 flex flex-col gap-8">
          <FiltersBar
            temaClaro={temaClaro}
            busca={busca}
            setBusca={setBusca}
            status={statusFiltro}
            setStatus={setStatusFiltro}
            ordenacao={ordenacao}
            setOrdenacao={setOrdenacao}
          />

          <CasesGrid
            temaClaro={temaClaro}
            abrirDetalhes={abrirDetalhes}
            casos={casosFiltrados}
          />
        </div>
      </div>

      <DetailsPanel
        temaClaro={temaClaro}
        aberto={detalhesAberto}
        fechar={fecharTudo}
        caso={casoDetalhado}
        participantes={participantes}
        evidencias={evidencias}
        historico={historico}
        usuarioLogadoId={usuarioStorage?.id}
        usuarioLogadoTipo={usuario?.tipoGlobal}
        usuarioLogadoCargo={usuario?.cargo}
        abrirParticipante={() => setParticipanteModal(true)}
        abrirEvidencia={() => setEvidenciaModal(true)}
        baixarArquivo={baixarArquivo}
        verificarIntegridade={verificarIntegridade}
        iniciarPericia={iniciarPericia}
        concluirCaso={concluirCaso}
        arquivarCaso={arquivarCaso}
        reabrirCaso={reabrirCaso}
        removerParticipante={removerParticipante}
        transferirCustodia={transferirCustodia}
        aceitarCustodia={aceitarCustodia}
        analisarCustodia={analisarCustodia}
        devolverCustodia={devolverCustodia}
        descartarCustodia={descartarCustodia}
      />

      <ParticipantModal
        aberto={participanteModal}
        fechar={() => setParticipanteModal(false)}
        temaClaro={temaClaro}
        buscaUsuario={buscaUsuario}
        setBuscaUsuario={setBuscaUsuario}
        papelSelecionado={papelSelecionado}
        setPapelSelecionado={setPapelSelecionado}
        adicionarParticipante={adicionarParticipante}
      />

      <EvidenceModal
        aberto={evidenciaModal}
        fechar={() => setEvidenciaModal(false)}
        temaClaro={temaClaro}
        arquivo={arquivo}
        setArquivo={setArquivo}
        enviarEvidencia={enviarEvidencia}
      />

      {novoCasoModal && (
        <NewCaseModal
          temaClaro={temaClaro}
          fechar={async () => {
            setNovoCasoModal(false);
            await carregarCasos();
          }}
          carregarCasos={carregarCasos}
          usuarioStorage={usuarioStorage}
          
        />
      )}
    </div>
  );
}