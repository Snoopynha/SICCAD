package com.camilly.forense.api.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import lombok.RequiredArgsConstructor;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import com.camilly.forense.api.controller.exception.RecursoNaoEncontradoException;
import com.camilly.forense.api.controller.exception.RegraDeNegocioException;
import com.camilly.forense.api.model.*;
import com.camilly.forense.api.model.enums.PapelCaso;
import com.camilly.forense.api.model.enums.StatusEvidencia;
import com.camilly.forense.api.repository.EvidenciaRepository;

@Service
@RequiredArgsConstructor
public class EvidenciaService {
    private final EvidenciaRepository evidenciaRepository;
    private final CasoService casoService;
    private final UsuarioService usuarioService;
    private final AutorizacaoService autorizacaoService;
    private final HistoricoCustodiaService historicoCustodiaService;
    // Para identificar onde deve guardar localmente as evidências
    private final String DIRETORIO_UPLOADS = "uploads_evidencias";

    @Transactional
    public Evidencia cadastrarEvidencia(Long idCaso, Long idUsuarioLogado, MultipartFile arquivo) throws Exception {
        Caso caso = casoService.buscarPorId(idCaso, idUsuarioLogado);
        autorizacaoService.validarPapelNoCaso(caso, idUsuarioLogado, PapelCaso.PERITO, PapelCaso.DELEGADO);
        Usuario perito = usuarioService.buscarUsuarioCompletoPorId(idUsuarioLogado);

        String hash = calcularHashSha256(arquivo.getBytes());
        String caminhoSalvo = subirArquivo(arquivo, hash);

        Evidencia evidencia = new Evidencia();
        evidencia.setCaso(caso);
        evidencia.setNomeOriginalArquivo(arquivo.getOriginalFilename());
        evidencia.setTamanhoBytes(arquivo.getSize());
        evidencia.setHashSha256(hash);
        evidencia.setCaminhoArquivo(caminhoSalvo);
        evidencia.setDataUpload(LocalDateTime.now());
        evidencia.setStatus(StatusEvidencia.APREENDIDA);
        evidencia.setCustodianteAtual(perito);

        Evidencia evidenciaSalva = evidenciaRepository.save(evidencia);
        historicoCustodiaService.registrarAcaoInicial(evidenciaSalva, perito, "Coleta inicial realizada, evidência salva no sistema");

        return evidenciaSalva;
    }

    public Evidencia buscarPorId(Long idCaso, Long idEvidencia, Long idUsuarioLogado) {
        Evidencia evidencia = evidenciaRepository.findById(idEvidencia).orElseThrow(() -> new RecursoNaoEncontradoException("Evidência não encontrada"));
        
        if (!evidencia.getCaso().getId().equals(idCaso)) {
            throw new RegraDeNegocioException("Esta evidência não pertence ao caso informado");
        }

        autorizacaoService.validarAcessoAoCaso(evidencia.getCaso(), idUsuarioLogado);

        return evidencia;
    }

    public List<Evidencia> listarEvidenciasDoCaso(Long idCaso, Long idUsuarioLogado) {
        Caso caso = casoService.buscarPorId(idCaso, idUsuarioLogado);
        return evidenciaRepository.findByCaso(caso);
    }

    private String subirArquivo(MultipartFile arquivo, String hash) throws IOException {
        Path pasta = Paths.get(DIRETORIO_UPLOADS);
        if(!Files.exists(pasta)) {
            Files.createDirectories(pasta);
        }

        String nome = hash.substring(0, 8) + "_" + arquivo.getOriginalFilename();
        Path caminhoDestino = pasta.resolve(nome);
        arquivo.transferTo(caminhoDestino);

        return caminhoDestino.toString();
    }

    public Resource baixarArquivo(Long idCaso, Long idEvidencia, Long idUsuarioLogado) throws Exception {
        Evidencia evidencia = buscarPorId(idCaso, idEvidencia, idUsuarioLogado);
        Path caminhoArquivo = Paths.get(evidencia.getCaminhoArquivo()); 
        Resource recurso = new UrlResource(caminhoArquivo.toUri());

        if (recurso.exists() && recurso.isReadable()) {
            return recurso;
        } else {
            throw new RecursoNaoEncontradoException("Arquivo não encontrado ou corrompido no servidor.");
        }
    }

    public boolean verificarIntegridade(Long idCaso, Long idEvidencia, Long idUsuarioLogado) throws Exception {
        Evidencia evidencia = buscarPorId(idCaso, idEvidencia, idUsuarioLogado);
        Path caminhoArquivo = Paths.get(evidencia.getCaminhoArquivo());

        if (!Files.exists(caminhoArquivo)) {
            throw new RecursoNaoEncontradoException("Arquivo físico não encontrado para validação.");
        }

        byte[] bytesArquivo = Files.readAllBytes(caminhoArquivo);
        String hashAtual = calcularHashSha256(bytesArquivo);

        return hashAtual.equals(evidencia.getHashSha256());
    }
    
    private String calcularHashSha256(byte[] bytes) throws NoSuchAlgorithmException {
        // MessageDigest gera hash de dados
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] encodedhash = digest.digest(bytes);

        // Transforma os bytes em uma String hexadecimal
        StringBuilder hexString = new StringBuilder(2 * encodedhash.length);
        for (byte b: encodedhash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }

}
