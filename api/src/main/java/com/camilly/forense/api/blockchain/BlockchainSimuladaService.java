package com.camilly.forense.api.blockchain;

import java.io.File;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import jakarta.annotation.PostConstruct;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public class BlockchainSimuladaService {
    private final String ARQUIVO_LEDGER = "blockchain_ledger.json";
    private final ObjectMapper objectMapper = new ObjectMapper();
    private List<Bloco> cadeia = new ArrayList<>();

    // Carrega a blockchain do arquivo quando o servidor inicia
    @PostConstruct
    public void inicializar() {
        File arquivo = new File(ARQUIVO_LEDGER);
        if (arquivo.exists()) {
            try {
                cadeia = objectMapper.readValue(arquivo, new TypeReference<List<Bloco>>() {});
            } catch (Exception e) {
                throw new RuntimeException("Erro ao ler a blockchain simulada", e);
            }
        } else {
            // Cria o Bloco Gênesis
            criarBlocoGenesis();
        }
    }

    private void criarBlocoGenesis() {
        Bloco genesis = new Bloco();
        genesis.setIndex(0);
        genesis.setTimestamp(Instant.now().getEpochSecond());
        genesis.setIdEvidencia(0L);
        genesis.setHashEvidencia("0");
        genesis.setIdUsuarioCriptografado("SISTEMA");
        genesis.setIdAcao(0);
        genesis.setHashAnterior("0");
        genesis.setHashDoBloco(calcularHash(genesis));
        
        cadeia.add(genesis);
        salvarNoDisco();
    }

    public Bloco registrarAcao(Long idEvidencia, String hashArquivo, Long idUsuario, int idAcao) {
        Bloco ultimoBloco = cadeia.get(cadeia.size() - 1);

        Bloco novoBloco = new Bloco();
        novoBloco.setIndex(ultimoBloco.getIndex() + 1);
        novoBloco.setTimestamp(Instant.now().getEpochSecond());
        novoBloco.setIdEvidencia(idEvidencia);
        novoBloco.setHashEvidencia(hashArquivo);
        novoBloco.setIdUsuarioCriptografado("User_" + idUsuario);
        novoBloco.setIdAcao(idAcao);
        novoBloco.setHashAnterior(ultimoBloco.getHashDoBloco());
        novoBloco.setHashDoBloco(calcularHash(novoBloco));

        cadeia.add(novoBloco);
        salvarNoDisco();
        
        return novoBloco;
    }

    private void salvarNoDisco() {
        try {
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(new File(ARQUIVO_LEDGER), cadeia);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao salvar bloco no disco", e);
        }
    }

    private String calcularHash(Bloco bloco) {
        String dadosParaHash = bloco.getIndex() + 
                               bloco.getTimestamp().toString() + 
                               bloco.getIdEvidencia() + 
                               bloco.getHashEvidencia() + 
                               bloco.getIdUsuarioCriptografado() + 
                               bloco.getIdAcao() + 
                               bloco.getHashAnterior();
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(dadosParaHash.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hashBytes) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }

            return hexString.toString();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao calcular hash", e);
        }
    }
    
    // Método para auditoria
    public boolean verificarIntegridadeDaBlockchain() {
        for (int i = 1; i < cadeia.size(); i++) {
            Bloco blocoAtual = cadeia.get(i);
            Bloco blocoAnterior = cadeia.get(i - 1);

            // O hash salvo no bloco atual ainda é válido? (Ninguém alterou o JSON na mão?)
            if (!blocoAtual.getHashDoBloco().equals(calcularHash(blocoAtual))) {
                return false; 
            }
            // O hash anterior salvo no bloco atual aponta mesmo para o bloco anterior?
            if (!blocoAtual.getHashAnterior().equals(blocoAnterior.getHashDoBloco())) {
                return false; 
            }
        }
        return true;
    }

}
