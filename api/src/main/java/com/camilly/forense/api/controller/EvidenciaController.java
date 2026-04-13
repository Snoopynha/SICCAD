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

import com.camilly.forense.api.model.Evidencia;
import com.camilly.forense.api.service.EvidenciaService;

@RestController
@RequestMapping("/api/casos/{idCaso}/evidencias")
@RequiredArgsConstructor
public class EvidenciaController {
    private final EvidenciaService evidenciaService;

    // POST - /api/casos/{idCaso}/evidencias?idUsuarioLogado={idUsuarioLogado}
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<Evidencia> fazerUploadEvidencia(@PathVariable Long idCaso, @RequestParam Long idUsuarioLogado, @RequestPart("arquivo") MultipartFile arquivo) throws Exception {
        Evidencia evidencia = evidenciaService.cadastrarEvidencia(idCaso, idUsuarioLogado, arquivo);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(evidencia);
    }

    // GET - /api/casos/{idCaso}/evidencias/{idEvidencia}
    @GetMapping("/{idEvidencia}")
    public ResponseEntity<Evidencia> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(evidenciaService.buscarPorId(id));
    }
    
    // GET - /api/casos/{idCaso}/evidencias/{idEvidencia}/download
    @GetMapping("/{idEvidencia}/download")
    public ResponseEntity<Resource> baixarEvidencia(@PathVariable Long idEvidencia) throws Exception {
        Resource arquivo = evidenciaService.carregarArquivoComoRecurso(idEvidencia);

        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + arquivo.getFilename() + "\"").body(arquivo);
    }

    // GET - /api/casos/{idCaso}/evidencias/{idEvidencia}/verificar-integridade
    @GetMapping("/{idEvidencia}/verificar-integridade")
    public ResponseEntity<Map<String, Object>> verificarIntegridade(@PathVariable Long idEvidencia) throws Exception {
        boolean integro = evidenciaService.verificarIntegridade(idEvidencia);

        Map<String, Object> resposta = new HashMap<>();
        resposta.put("idEvidencia", idEvidencia);
        resposta.put("integro", integro);
        resposta.put("mensagem", integro ? "Sucesso: O arquivo está íntegro, não foi modificado" : "Crítico: O arquivo foi alterado");
        
        return ResponseEntity.ok(resposta);
    }

}
