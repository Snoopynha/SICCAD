package com.camilly.forense.api.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

import com.camilly.forense.api.blockchain.BlockchainSimuladaService;
import com.camilly.forense.api.blockchain.Bloco;
import com.camilly.forense.api.controller.exception.RecursoNaoEncontradoException;
import com.camilly.forense.api.controller.exception.RegraDeNegocioException;
import com.camilly.forense.api.dto.HistoricoCustodiaResponse;
import com.camilly.forense.api.model.*;
import com.camilly.forense.api.model.enums.AcaoCustodia;
import com.camilly.forense.api.model.enums.PapelCaso;
import com.camilly.forense.api.model.enums.StatusEvidencia;
import com.camilly.forense.api.repository.HistoricoCustodiaRepository;
import com.camilly.forense.api.repository.EvidenciaRepository;

@Service
@RequiredArgsConstructor
public class HistoricoCustodiaService {
    private final HistoricoCustodiaRepository historicoCustodiaRepository;
    private final UsuarioService usuarioService;
    private final EvidenciaRepository evidenciaRepository;
    private final AutorizacaoService autorizacaoService;
    private final BlockchainSimuladaService blockchainService;

    @Transactional
    public void registrarAcaoInicial(Evidencia evidencia, Usuario perito, String justificativa) {
        HistoricoCustodia log = new HistoricoCustodia();
        log.setEvidencia(evidencia);
        log.setCustodianteAnterior(null);
        log.setCustodiantePosterior(perito);
        log.setAcao(AcaoCustodia.COLETA);
        log.setJustificativa(justificativa);
        log.setDataHora(LocalDateTime.now());
        log.setValidacaoHash(evidencia.getHashSha256());

        Bloco bloco = blockchainService.registrarAcao(
            evidencia.getId(), 
            evidencia.getHashSha256(), 
            perito.getId(), 
            1 // 1 = Coleta Inicial
        );
        
        log.setAuditoriaCorrenteHash(bloco.getHashDoBloco());

        historicoCustodiaRepository.save(log);
    }

    @Transactional
    public HistoricoCustodia transferirCustodia(Long idEvidencia, Long idUsuarioLogado, Long idDestino, String justificativa) {
        Evidencia evidencia = buscarEvidencia(idEvidencia, idUsuarioLogado);
        validarCustodianteAtual(evidencia, idUsuarioLogado);

        Usuario usuarioDestino = usuarioService.buscarUsuarioCompletoPorId(idDestino);
        autorizacaoService.validarAcessoAoCaso(evidencia.getCaso(), idDestino);
        HistoricoCustodia log = criarLogBase(evidencia, evidencia.getCustodianteAtual(), usuarioDestino, AcaoCustodia.TRANSFERENCIA, justificativa);

        return historicoCustodiaRepository.save(log);
    }

    @Transactional
    public HistoricoCustodia aceitarCustodia(Long idEvidencia, Long idUsuarioLogado) {
        Evidencia evidencia = buscarEvidencia(idEvidencia, idUsuarioLogado);
        HistoricoCustodia ultimoLog = historicoCustodiaRepository.findTopByEvidenciaIdOrderByDataHoraDesc(idEvidencia);

        if (ultimoLog == null || ultimoLog.getAcao() != AcaoCustodia.TRANSFERENCIA) {
            throw new RegraDeNegocioException("Não há transferência pendente");
        }

        if (!ultimoLog.getCustodiantePosterior().getId().equals(idUsuarioLogado)) {
            throw new RegraDeNegocioException("O usuário não é o destinatário");
        }

        Usuario usuario = usuarioService.buscarUsuarioCompletoPorId(idUsuarioLogado);

        evidencia.setCustodianteAtual(usuario);
        evidencia.setStatus(StatusEvidencia.EM_ANALISE);
        evidenciaRepository.save(evidencia);

        HistoricoCustodia log = criarLogBase(evidencia, usuario, usuario, AcaoCustodia.RECEBIMENTO, "Custódia aceita");
        return historicoCustodiaRepository.save(log);
    }

    @Transactional
    public HistoricoCustodia registrarAnalise(Long idEvidencia, Long idUsuarioLogado, String justificativa) {
        Evidencia evidencia = buscarEvidencia(idEvidencia, idUsuarioLogado);
        validarCustodianteAtual(evidencia, idUsuarioLogado);
        autorizacaoService.validarPapelNoCaso(evidencia.getCaso(), idUsuarioLogado, PapelCaso.PERITO, PapelCaso.AUDITOR);

        evidencia.setStatus(StatusEvidencia.EM_ANALISE);
        evidenciaRepository.save(evidencia);

        HistoricoCustodia log = criarLogBase(evidencia, evidencia.getCustodianteAtual(), evidencia.getCustodianteAtual(), AcaoCustodia.ANALISE, justificativa);
        return historicoCustodiaRepository.save(log);
    }

    @Transactional
    public HistoricoCustodia registrarDevolucao(Long idEvidencia, Long idUsuarioLogado, String justificativa) {
        Evidencia evidencia = buscarEvidencia(idEvidencia, idUsuarioLogado);
        validarCustodianteAtual(evidencia, idUsuarioLogado);

        HistoricoCustodia logTransferencia = historicoCustodiaRepository.findTopByEvidenciaIdAndAcaoInOrderByDataHoraDesc(idEvidencia, List.of(AcaoCustodia.TRANSFERENCIA, AcaoCustodia.RECEBIMENTO));
        
        if (logTransferencia == null) {
            throw new RegraDeNegocioException("Não foi possível identificar o custodiante anterior");
        }
        
        Usuario atual = evidencia.getCustodianteAtual();
        Usuario anterior = logTransferencia.getCustodianteAnterior();

        evidencia.setCustodianteAtual(anterior);
        evidencia.setStatus(StatusEvidencia.DEVOLVIDA);
        evidenciaRepository.save(evidencia);

        HistoricoCustodia log = criarLogBase(evidencia, atual, anterior, AcaoCustodia.DEVOLUCAO, justificativa);
        return historicoCustodiaRepository.save(log);
    }

    @Transactional
    public HistoricoCustodia registrarDescarte(Long idEvidencia, Long idUsuarioLogado, String justificativa) {
        Evidencia evidencia = buscarEvidencia(idEvidencia, idUsuarioLogado);
        validarCustodianteAtual(evidencia, idUsuarioLogado);
        autorizacaoService.validarPapelNoCaso(evidencia.getCaso(), idUsuarioLogado, PapelCaso.DELEGADO);

        Usuario atual = evidencia.getCustodianteAtual();

        evidencia.setCustodianteAtual(null);
        evidencia.setStatus(StatusEvidencia.DESCARTADA);
        evidenciaRepository.save(evidencia);
        
        HistoricoCustodia log = criarLogBase(evidencia, atual, null, AcaoCustodia.DESCARTE, justificativa);
        return historicoCustodiaRepository.save(log);
    }

    @Transactional(readOnly = true)
    public List<HistoricoCustodiaResponse> listarHistorico(Long idEvidencia, Long idUsuarioLogado) {
        Evidencia evidencia = buscarEvidencia(idEvidencia, idUsuarioLogado);
    
        return historicoCustodiaRepository.findByEvidenciaIdOrderByDataHoraAsc(idEvidencia).stream().map(this::toResponse).toList();
    }

    private Evidencia buscarEvidencia(Long idEvidencia, Long idUsuarioLogado) {
        Evidencia evidencia = evidenciaRepository.findById(idEvidencia).orElseThrow(() -> new RecursoNaoEncontradoException("Evidência não encontrada"));
        autorizacaoService.validarAcessoAoCaso(evidencia.getCaso(), idUsuarioLogado);

        return evidencia;
    }

    private void validarCustodianteAtual(Evidencia evidencia, Long idUsuarioLogado) {
        if (evidencia.getCustodianteAtual() == null || !evidencia.getCustodianteAtual().getId().equals(idUsuarioLogado)) {
            throw new RegraDeNegocioException("Apenas o custodiante atual pode realizar esta ação com a evidência");
        }
    }

    private HistoricoCustodia criarLogBase(Evidencia evidencia, Usuario atual, Usuario destino, AcaoCustodia acao, String justificativa) {
        HistoricoCustodia log = new HistoricoCustodia();
        log.setEvidencia(evidencia);
        log.setCustodianteAnterior(atual);
        log.setCustodiantePosterior(destino);
        log.setAcao(acao);
        log.setJustificativa(justificativa);
        log.setDataHora(LocalDateTime.now());
        log.setValidacaoHash(evidencia.getHashSha256());
        
        int idAcaoBlockchain = converterAcaoParaId(acao);

        Bloco bloco = blockchainService.registrarAcao(
            evidencia.getId(), 
            evidencia.getHashSha256(), 
            atual.getId(), 
            idAcaoBlockchain
        );

        log.setAuditoriaCorrenteHash(bloco.getHashDoBloco());

        return log;
    }

    private HistoricoCustodiaResponse toResponse(HistoricoCustodia log) {
        String anterior = log.getCustodianteAnterior() != null? log.getCustodianteAnterior().getNome(): null;
        String posterior = log.getCustodiantePosterior() != null? log.getCustodiantePosterior().getNome(): null;
        
        return new HistoricoCustodiaResponse(
            log.getAcao().name(),
            descreverAcao(log.getAcao()),
            anterior,
            posterior,
            log.getDataHora(),
            log.getJustificativa(),
            log.getValidacaoHash(),
            log.getAuditoriaCorrenteHash()
        );
    }

    private String descreverAcao(AcaoCustodia acao) {
        return switch (acao) {
            case COLETA -> "Coleta da evidência";
            case TRANSFERENCIA -> "Transferência de custódia";
            case RECEBIMENTO -> "Recebimento da custódia";
            case ANALISE -> "Análise da evidência";
            case DEVOLUCAO -> "Devolução da evidência";
            case DESCARTE -> "Descarte da evidência";
        };
    }

    private int converterAcaoParaId(AcaoCustodia acao) {
        return switch (acao) {
            case COLETA -> 1;
            case TRANSFERENCIA -> 2;
            case RECEBIMENTO -> 3;
            case ANALISE -> 4;
            case DEVOLUCAO -> 5;
            case DESCARTE -> 6;
            default -> 99;
        };
    }

}
