package com.camilly.forense.api.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

import com.camilly.forense.api.model.HistoricoCustodia;
import com.camilly.forense.api.service.HistoricoCustodiaService;
import com.camilly.forense.api.dto.HistoricoCustodiaResponse;
import com.camilly.forense.api.dto.JustificativaDTO;

@RestController
@RequestMapping("/api/evidencias/{idEvidencia}/custodia")
@RequiredArgsConstructor
public class HistoricoCustodiaController {
    private final HistoricoCustodiaService historicoCustodiaService;

    // POST - /api/casos/{idCaso}/evidencias/{idEvidencia}/transferir?idDestino={idDestino}
    @PostMapping("/transferir")
    public ResponseEntity<HistoricoCustodia> transferir(@PathVariable Long idEvidencia, @RequestHeader("X-User-Id") Long idUsuarioLogado, @RequestParam Long idDestino, @RequestBody JustificativaDTO dto) {
        return ResponseEntity.ok(historicoCustodiaService.transferirCustodia(idEvidencia, idUsuarioLogado, idDestino, dto.justificativa()));
    }

    // PATCH - /api/casos/{idCaso}/evidencias/{idEvidencia}/aceitar
    @PatchMapping("/aceitar")
    public ResponseEntity<HistoricoCustodia> aceitar(@PathVariable Long idEvidencia, @RequestHeader("X-User-Id") Long idUsuarioLogado) {
        return ResponseEntity.ok(historicoCustodiaService.aceitarCustodia(idEvidencia, idUsuarioLogado));
    }

    // POST - /api/casos/{idCaso}/evidencias/{idEvidencia}/analisar
    @PostMapping("/analisar")
    public ResponseEntity<HistoricoCustodia> analisar(@PathVariable Long idEvidencia, @RequestHeader("X-User-Id") Long idUsuarioLogado, @RequestBody JustificativaDTO dto) {
        return ResponseEntity.ok(historicoCustodiaService.registrarAnalise(idEvidencia, idUsuarioLogado, dto.justificativa()));
    }
    
    // POST - /api/casos/{idCaso}/evidencias/{idEvidencia}/devolver
    @PostMapping("/devolver")
    public ResponseEntity<HistoricoCustodia> devolver(@PathVariable Long idEvidencia, @RequestHeader("X-User-Id") Long idUsuarioLogado, @RequestBody JustificativaDTO dto) {
        return ResponseEntity.ok(historicoCustodiaService.registrarDevolucao(idEvidencia, idUsuarioLogado, dto.justificativa()));
    }
    
    // POST - /api/casos/{idCaso}/evidencias/{idEvidencia}/descartar
    @PostMapping("/descartar")
    public ResponseEntity<HistoricoCustodia> descartar(@PathVariable Long idEvidencia, @RequestHeader("X-User-Id") Long idUsuarioLogado, @RequestBody JustificativaDTO dto) {
        return ResponseEntity.ok(historicoCustodiaService.registrarDescarte(idEvidencia, idUsuarioLogado, dto.justificativa()));
    }

    // GET - /api/casos/{idCaso}/evidencias/{idEvidencia}/listarHistorico
    @GetMapping("/historico")
    public ResponseEntity<List<HistoricoCustodiaResponse>> listarHistorico(@PathVariable Long idEvidencia, @RequestHeader("X-User-Id") Long idUsuarioLogado) {
        return ResponseEntity.ok(historicoCustodiaService.listarHistorico(idEvidencia, idUsuarioLogado));
    }

}
