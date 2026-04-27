package com.camilly.forense.api.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import lombok.RequiredArgsConstructor;
import java.util.Map;
import java.util.HashMap;
import java.util.List;

import com.camilly.forense.api.model.Evidencia;
import com.camilly.forense.api.service.EvidenciaService;

@RestController
@RequestMapping("/api/casos/{idCaso}/evidencias")
@RequiredArgsConstructor
public class EvidenciaController {
    private final EvidenciaService evidenciaService;

    // POST - /api/casos/{idCaso}/evidencias
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<Evidencia> cadastrar(@PathVariable Long idCaso, @RequestHeader("X-User-Id") Long idUsuarioLogado, @RequestPart("arquivo") MultipartFile arquivo) throws Exception {
        Evidencia evidencia = evidenciaService.cadastrarEvidencia(idCaso, idUsuarioLogado, arquivo);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(evidencia);
    }

    // GET - /api/casos/{idCaso}/evidencias/{idEvidencia}
    @GetMapping("/{idEvidencia}")
    public ResponseEntity<Evidencia> buscarPorId(@PathVariable Long idCaso, @PathVariable Long idEvidencia, @RequestHeader("X-User-Id") Long idUsuarioLogado) {
        return ResponseEntity.ok(evidenciaService.buscarPorId(idCaso, idEvidencia, idUsuarioLogado));
    }

    // GET - /api/casos/{idCaso}/evidencias
    @GetMapping("")
    public ResponseEntity<List<Evidencia>> listarEvidenciasDoCaso(@PathVariable Long idCaso, @RequestHeader("X-User-Id") Long idUsuarioLogado) {
        return ResponseEntity.ok(evidenciaService.listarEvidenciasDoCaso(idCaso, idUsuarioLogado));
    }
    
    // GET - /api/casos/{idCaso}/evidencias/{idEvidencia}/baixar
    @GetMapping("/{idEvidencia}/baixar")
    public ResponseEntity<Resource> baixar(@PathVariable Long idCaso, @PathVariable Long idEvidencia, @RequestHeader("X-User-Id") Long idUsuarioLogado) throws Exception {
        Resource arquivo = evidenciaService.baixarArquivo(idCaso, idEvidencia, idUsuarioLogado);

        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + arquivo.getFilename() + "\"").body(arquivo);
    }

    // GET - /api/casos/{idCaso}/evidencias/{idEvidencia}/verificar-integridade
    @GetMapping("/{idEvidencia}/verificar-integridade")
    public ResponseEntity<Map<String, Object>> verificarIntegridade(@PathVariable Long idCaso, @PathVariable Long idEvidencia, @RequestHeader("X-User-Id") Long idUsuarioLogado) throws Exception {
        boolean integro = evidenciaService.verificarIntegridade(idCaso, idEvidencia, idUsuarioLogado);

        Map<String, Object> resposta = new HashMap<>();
        resposta.put("idEvidencia", idEvidencia);
        resposta.put("integro", integro);
        resposta.put("mensagem", integro ? "Sucesso: O arquivo está íntegro, não foi modificado" : "Crítico: O arquivo foi alterado");
        
        return ResponseEntity.ok(resposta);
    }

}
