package com.camilly.forense.api.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import java.time.LocalDateTime;

import com.camilly.forense.api.controller.exception.RecursoNaoEncontradoException;
import com.camilly.forense.api.controller.exception.RegraDeNegocioException;
import com.camilly.forense.api.model.*;
import com.camilly.forense.api.model.enums.AcaoCustodia;
import com.camilly.forense.api.model.enums.StatusEvidencia;
import com.camilly.forense.api.repository.HistoricoCustodiaRepository;
import com.camilly.forense.api.repository.EvidenciaRepository;

@Service
@RequiredArgsConstructor
public class HistoricoCustodiaService {
    private final HistoricoCustodiaRepository historicoCustodiaRepository;
    private final UsuarioService usuarioService;
    private final EvidenciaRepository evidenciaRepository;

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

        historicoCustodiaRepository.save(log);
    }

    @Transactional
    public HistoricoCustodia transferirCustodia(Long idEvidencia, Long idUsuarioOrigem, Long idUsuarioDestino, String justificativa) {
        Evidencia evidencia = evidenciaRepository.findById(idEvidencia).orElseThrow(() -> new RecursoNaoEncontradoException("Evidência não encontrada"));

        if (!evidencia.getCustodianteAtual().getId().equals(idUsuarioOrigem)) {
            throw new RegraDeNegocioException("Você não é o custodiante atual dessa evidência. Transferência bloqueada");
        }

        if (evidencia.getCustodianteAtual() == null) {
            throw new RegraDeNegocioException("Essa evidência não possui um custodiante ativo");
        }

        Usuario usuarioOrigem = usuarioService.buscarPorId(idUsuarioOrigem);
        Usuario usuarioDestino = usuarioService.buscarPorId(idUsuarioDestino);

        HistoricoCustodia transacao = new HistoricoCustodia();
        transacao.setEvidencia(evidencia);
        transacao.setCustodianteAnterior(usuarioOrigem);
        transacao.setCustodiantePosterior(usuarioDestino);
        transacao.setAcao(AcaoCustodia.TRANSFERENCIA);
        transacao.setJustificativa(justificativa);
        transacao.setDataHora(LocalDateTime.now());
        transacao.setValidacaoHash(evidencia.getHashSha256());

        HistoricoCustodia logSalvo = historicoCustodiaRepository.save(transacao);

        evidencia.setCustodianteAtual(usuarioDestino);
        evidencia.setStatus(StatusEvidencia.EM_ANALISE);
        evidenciaRepository.save(evidencia);

        return logSalvo;
    }


    @Transactional
    public HistoricoCustodia registrarAnalise(Long idEvidencia, Long idUsuarioLogado, String justificativa) {
        Evidencia evidencia = evidenciaRepository.findById(idEvidencia).orElseThrow(() -> new RecursoNaoEncontradoException("Evidência não encontrada"));

        if (!evidencia.getCustodianteAtual().getId().equals(idUsuarioLogado)) {
            throw new RegraDeNegocioException("Apenas o custodiante atual pode iniciar a análise dessa evidência");
        }

        HistoricoCustodia log = new HistoricoCustodia();
        log.setEvidencia(evidencia);
        log.setCustodianteAnterior(evidencia.getCustodianteAtual());
        log.setCustodiantePosterior(evidencia.getCustodianteAtual());
        log.setAcao(AcaoCustodia.ANALISE);
        log.setJustificativa(justificativa);
        log.setDataHora(LocalDateTime.now());
        log.setValidacaoHash(evidencia.getHashSha256());

        HistoricoCustodia logSalvo = historicoCustodiaRepository.save(log);

        evidencia.setStatus(StatusEvidencia.EM_ANALISE);
        evidenciaRepository.save(evidencia);

        return logSalvo;
    }


    @Transactional
    public HistoricoCustodia registrarDevolucao(Long idEvidencia, Long idUsuarioLogado, String justificativa) {
        Evidencia evidencia = evidenciaRepository.findById(idEvidencia).orElseThrow(() -> new RecursoNaoEncontradoException("Evidência não encontrada"));

        if (!evidencia.getCustodianteAtual().getId().equals(idUsuarioLogado)) {
            throw new RegraDeNegocioException("Apenas o custodiante atual pode devolver essa evidência");
        }

        HistoricoCustodia log = new HistoricoCustodia();
        log.setEvidencia(evidencia);
        log.setCustodianteAnterior(evidencia.getCustodianteAtual());
        log.setCustodiantePosterior(null);
        log.setAcao(AcaoCustodia.DEVOLUCAO);
        log.setJustificativa(justificativa);
        log.setDataHora(LocalDateTime.now());
        log.setValidacaoHash(evidencia.getHashSha256());

        HistoricoCustodia logSalvo = historicoCustodiaRepository.save(log);

        evidencia.setCustodianteAtual(null);
        evidencia.setStatus(StatusEvidencia.DEVOLVIDA);
        evidenciaRepository.save(evidencia);

        return logSalvo;
    }

    @Transactional
    public HistoricoCustodia registrarDescarte(Long idEvidencia, Long idUsuarioLogado, String justificativa) {
        Evidencia evidencia = evidenciaRepository.findById(idEvidencia).orElseThrow(() -> new RecursoNaoEncontradoException("Evidência não encontrada"));

        if (!evidencia.getCustodianteAtual().getId().equals(idUsuarioLogado)) {
            throw new RegraDeNegocioException("Apenas o custodiante atual pode descartar essa evidência");
        }

        HistoricoCustodia log = new HistoricoCustodia();
        log.setEvidencia(evidencia);
        log.setCustodianteAnterior(evidencia.getCustodianteAtual());
        log.setCustodiantePosterior(null);
        log.setAcao(AcaoCustodia.DEVOLUCAO);
        log.setJustificativa(justificativa);
        log.setDataHora(LocalDateTime.now());
        log.setValidacaoHash(evidencia.getHashSha256());

        HistoricoCustodia logSalvo = historicoCustodiaRepository.save(log);

        evidencia.setCustodianteAtual(null);
        evidencia.setStatus(StatusEvidencia.DESCARTADA);
        evidenciaRepository.save(evidencia);
        
        return logSalvo;
    }
}
