package com.camilly.forense.api.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import lombok.RequiredArgsConstructor;

import com.camilly.forense.api.model.Evidencia;
import com.camilly.forense.api.service.EvidenciaService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;



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
    
}
