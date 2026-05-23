import { useEffect, useState } from "react";

import Header from "../components/Dashboard/Header";
import FiltersBar from "../components/Dashboard/FiltersBar";
import CasesGrid from "../components/Dashboard/CasesGrid";
import DetailsPanel from "../components/Dashboard/DetailsPanel";

import NewCaseModal from "../components/Dashboard/Modals/NewCaseModal";
import ParticipantModal from "../components/Dashboard/Modals/ParticipantModal";
import EvidenceModal from "../components/Dashboard/Modals/EvidenceModal";

export default function Dashboard() {

  const usuarioStorage = JSON.parse(
    localStorage.getItem("usuario")
  );

  const [usuario, setUsuario] =
    useState(null);

  const [casos, setCasos] =
    useState([]);

  const [temaClaro, setTemaClaro] =
    useState(false);

  const [detalhesAberto, setDetalhesAberto] =
    useState(false);

  const [casoSelecionado, setCasoSelecionado] =
    useState(null);

  const [casoDetalhado, setCasoDetalhado] =
    useState(null);

  const [participantes, setParticipantes] =
    useState([]);

  const [evidencias, setEvidencias] =
    useState([]);

  const [historico, setHistorico] =
    useState([]);

  const [novoCasoModal, setNovoCasoModal] =
    useState(false);

  const [participanteModal, setParticipanteModal] =
    useState(false);

  const [evidenciaModal, setEvidenciaModal] =
    useState(false);

  const [buscaUsuario, setBuscaUsuario] =
    useState("");

  const [papelSelecionado, setPapelSelecionado] =
    useState("DELEGADO");

  const [arquivo, setArquivo] =
    useState(null);

  const [busca, setBusca] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("");
  const [ordenacao, setOrdenacao] = useState("");


  useEffect(() => {

    function filtrarCasos(lista) {
  let resultado = [...lista];

  if (busca) {
    resultado = resultado.filter((c) =>
      c.titulo?.toLowerCase().includes(busca.toLowerCase()) ||
      String(c.numeroProcesso || "").includes(busca) ||
      c.usuarios?.some((u) =>
        u.nome?.toLowerCase().includes(busca.toLowerCase())
      )
    );
  }

  if (statusFiltro) {
    resultado = resultado.filter(
      (c) => c.status === statusFiltro
    );
  }

  if (ordenacao === "recentes") {
    resultado.sort(
      (a, b) =>
        new Date(b.dataAbertura) - new Date(a.dataAbertura)
    );
  }

  if (ordenacao === "antigos") {
    resultado.sort(
      (a, b) =>
        new Date(a.dataAbertura) - new Date(b.dataAbertura)
    );
  }

  return resultado;
}

    async function carregarUsuario() {

      if (!usuarioStorage?.id) return;

      try {

        const res = await fetch(
          `http://localhost:8080/api/usuarios/${usuarioStorage.id}`
        );

        const data = await res.json();

        setUsuario(data);

      } catch (err) {

        console.log(err);

      }

    }

    carregarUsuario();

  }, []);

  async function carregarCasos() {

    try {

      const res = await fetch(
        "http://localhost:8080/api/casos",
        {
          headers: {
            "X-User-Id": usuarioStorage.id
          }
        }
      );

      if (!res.ok) {

        console.log(
          "Erro ao carregar casos"
        );

        return;

      }

      const data = await res.json();

      setCasos(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {

      console.log(err);

    }

  }

  useEffect(() => {

    if (usuarioStorage?.id) {

      carregarCasos();

    }

  }, []);

  function gerarHistoricoPadrao(caso) {

    if (!caso) return [];

    return [
      {
        acao: "Caso criado",

        justificativa:
          `Criado em ${new Date(
            caso.dataAbertura
          ).toLocaleString("pt-BR")}`
      }
    ];

  }

  async function abrirDetalhes(idCaso) {

    try {

      const headers = {
        "X-User-Id": usuarioStorage.id
      };

      const resCaso = await fetch(
        `http://localhost:8080/api/casos/${idCaso}`,
        { headers }
      );

      const casoData =
        await resCaso.json();

      const resParticipantes =
        await fetch(
          `http://localhost:8080/api/casos/${idCaso}/participantes`,
          { headers }
        );

      const participantesData =
        await resParticipantes.json();

      const resEvidencias =
        await fetch(
          `http://localhost:8080/api/casos/${idCaso}/evidencias`,
          { headers }
        );

      const evidenciasData =
        await resEvidencias.json();

      let historicoCompleto =
        gerarHistoricoPadrao(
          casoData
        );

      if (Array.isArray(evidenciasData)) {

        for (let evidencia of evidenciasData) {

          historicoCompleto.push({

            tipoAcao:
              "UPLOAD DE EVIDÊNCIA",

            justificativa:
              `${evidencia.nomeOriginalArquivo ||
                evidencia.nomeArquivo}
               enviado para o caso`,

            dataEvento:
              evidencia.dataUpload

          });

        }

      }

      historicoCompleto.sort(
        (a, b) =>
          new Date(
            b.dataEvento ||
            b.dataCriacao
          ) -
          new Date(
            a.dataEvento ||
            a.dataCriacao
          )
      );

      setCasoSelecionado(idCaso);

      setCasoDetalhado(casoData);

      setParticipantes(
        Array.isArray(participantesData)
          ? participantesData
          : []
      );

      setEvidencias(
        Array.isArray(evidenciasData)
          ? evidenciasData
          : []
      );

      setHistorico(
        historicoCompleto
      );

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

  async function alterarStatus(endpoint) {

    try {

      const res = await fetch(
        `http://localhost:8080/api/casos/${casoSelecionado}/${endpoint}`,
        {
          method: "PATCH",

          headers: {
            "X-User-Id": usuarioStorage.id
          }
        }
      );

      if (!res.ok) {

        alert(
          "Erro ao alterar status"
        );

        return;

      }

      await carregarCasos();

      await abrirDetalhes(
        casoSelecionado
      );

    } catch (err) {

      console.log(err);

    }

  }

  async function iniciarPericia() {

    await alterarStatus(
      "iniciar-pericia"
    );

  }

  async function concluirCaso() {

    await alterarStatus(
      "concluir"
    );

  }

  async function arquivarCaso() {

    await alterarStatus(
      "arquivar"
    );

  }

  async function reabrirCaso() {

    await alterarStatus(
      "reabrir"
    );

  }


  async function verificarIntegridade(idEvidencia) {

    try {

      const res = await fetch(
        `http://localhost:8080/api/casos/${casoSelecionado}/evidencias/${idEvidencia}/verificar`,
        {
          headers: {
            "X-User-Id":
              usuarioStorage.id
          }
        }
      );

      if (!res.ok) {

        alert(
          "Erro ao verificar integridade"
        );

        return;

      }

      const data =
        await res.json();

      alert(
        data.integridade
          ? "Arquivo íntegro"
          : "Arquivo alterado"
      );

    } catch (err) {

      console.log(err);

    }

  }

  async function adicionarParticipante() {

    try {

      if (!buscaUsuario) {

        alert(
          "Digite o email do usuário"
        );

        return;

      }

      const resUsuarios =
        await fetch(
          "http://localhost:8080/api/usuarios"
        );

      if (!resUsuarios.ok) {

        alert(
          "Erro ao buscar usuários"
        );

        return;

      }

      const usuarios =
        await resUsuarios.json();

      const usuarioEncontrado =
        usuarios.find(
          (u) =>
            u.email?.toLowerCase() ===
            buscaUsuario.toLowerCase()
        );

      if (!usuarioEncontrado) {

        alert(
          "Usuário não encontrado"
        );

        return;

      }

      const res =
        await fetch(
          `http://localhost:8080/api/casos/${casoSelecionado}/participantes?idUsuario=${usuarioEncontrado.id}&papel=${papelSelecionado}`,
          {
            method: "POST",

            headers: {
              "X-User-Id":
                usuarioStorage.id
            }
          }
        );

      if (!res.ok) {

        const erro =
          await res.text();

        console.log(erro);

        alert(
          "Erro ao adicionar participante"
        );

        return;

      }

      setBuscaUsuario("");

      setParticipanteModal(false);

      await abrirDetalhes(
        casoSelecionado
      );

      await carregarCasos();

    } catch (err) {

      console.log(err);

      alert(
        "Erro ao adicionar participante"
      );

    }

  }

  async function removerParticipante(idUsuario) {

    try {

      const confirmar =
        confirm(
          "Deseja remover este participante?"
        );

      if (!confirmar) return;

      const res = await fetch(
        `http://localhost:8080/api/casos/${casoSelecionado}/participantes/${idUsuario}`,
        {
          method: "DELETE",

          headers: {
            "X-User-Id":
              usuarioStorage.id
          }
        }
      );

      if (!res.ok) {

        const erro =
          await res.text();

        alert(erro);

        return;

      }

      const novaLista =
        participantes.filter(
          (p) =>
            Number(p.idUsuario) !==
            Number(idUsuario)
        );

      setParticipantes(novaLista);

      setCasos((estadoAtual) =>
        estadoAtual.map((caso) => {

          if (
            Number(caso.id) ===
            Number(casoSelecionado)
          ) {

            return {

              ...caso,

              usuarios:
                novaLista

            };

          }

          return caso;

        })
      );

    } catch (err) {

      console.log(err);

    }

  }

  async function enviarEvidencia() {

    try {

      if (!arquivo) {

        alert(
          "Selecione um arquivo"
        );

        return;

      }

      const formData =
        new FormData();

      formData.append(
        "arquivo",
        arquivo
      );

      const res = await fetch(
        `http://localhost:8080/api/casos/${casoSelecionado}/evidencias`,
        {
          method: "POST",

          headers: {
            "X-User-Id":
              usuarioStorage.id
          },

          body: formData
        }
      );

      if (!res.ok) {

        alert(
          "Erro ao enviar evidência"
        );

        return;

      }

      await abrirDetalhes(
        casoSelecionado
      );

      setArquivo(null);

      setEvidenciaModal(false);

    } catch (err) {

      console.log(err);

    }

  }

  async function baixarArquivo(idEvidencia) {

    try {

      const res = await fetch(
        `http://localhost:8080/api/casos/${casoSelecionado}/evidencias/${idEvidencia}/baixar`,
        {
          headers: {
            "X-User-Id":
              usuarioStorage.id
          }
        }
      );

      const blob =
        await res.blob();

      const url =
        window.URL.createObjectURL(
          blob
        );

      const a =
        document.createElement("a");

      a.href = url;

      a.download =
        "evidencia";

      a.click();

    } catch (err) {

      console.log(err);

    }

  }

  return (

    <div className={`
      min-h-screen transition-all
      ${temaClaro
        ? "bg-[#f5f7fb] text-black"
        : "bg-[#050505] text-white"}
    `}>

      <div className="
        max-w-[1280px]
        mx-auto
        px-10
        py-8
      ">

        <Header
          temaClaro={temaClaro}
          setTemaClaro={setTemaClaro}
          abrirNovoCaso={() =>
            setNovoCasoModal(true)
          }
          usuario={usuario}
        />

        <div className="
          mt-10
          flex flex-col
          gap-8
        ">

          <FiltersBar
            temaClaro={temaClaro}
          />

          <CasesGrid
            temaClaro={temaClaro}
            abrirDetalhes={abrirDetalhes}
            casos={casos}
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
        usuarioLogadoId={usuarioStorage.id}
        abrirParticipante={() =>
          setParticipanteModal(true)
        }
        abrirEvidencia={() =>
          setEvidenciaModal(true)
        }
        baixarArquivo={baixarArquivo}
        verificarIntegridade={verificarIntegridade}
        iniciarPericia={iniciarPericia}
        concluirCaso={concluirCaso}
        arquivarCaso={arquivarCaso}
        reabrirCaso={reabrirCaso}
        removerParticipante={
          removerParticipante
        }
      />

      <ParticipantModal
        aberto={participanteModal}
        fechar={() =>
          setParticipanteModal(false)
        }
        temaClaro={temaClaro}
        buscaUsuario={buscaUsuario}
        setBuscaUsuario={setBuscaUsuario}
        papelSelecionado={
          papelSelecionado
        }
        setPapelSelecionado={
          setPapelSelecionado
        }
        adicionarParticipante={
          adicionarParticipante
        }
      />

      <EvidenceModal
        aberto={evidenciaModal}
        fechar={() =>
          setEvidenciaModal(false)
        }
        temaClaro={temaClaro}
        arquivo={arquivo}
        setArquivo={setArquivo}
        enviarEvidencia={
          enviarEvidencia
        }
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