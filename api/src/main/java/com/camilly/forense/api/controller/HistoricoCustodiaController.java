package com.camilly.forense.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

import com.camilly.forense.api.model.HistoricoCustodia;
import com.camilly.forense.api.service.HistoricoCustodiaService;
import com.camilly.forense.api.dto.JustificativaDTO;

@RestController
@RequestMapping("/api/evidencias/{idEvidencia}/custodia")
@RequiredArgsConstructor
public class HistoricoCustodiaController {
    private final HistoricoCustodiaService historicoCustodiaService;

    // POST - /api/evidencias/{idEvidencia}/custodia/transferir?idOrigem={idOrigem}&idDestino={idDestino}
    @PostMapping("/transferir")
    public ResponseEntity<HistoricoCustodia> transferir(@PathVariable Long idEvidencia, @RequestParam Long idOrigem, @RequestParam Long idDestino, @RequestBody JustificativaDTO dto) {
        return ResponseEntity.ok(historicoCustodiaService.transferirCustodia(idEvidencia, idOrigem, idDestino, dto.justificativa()));
    }

    // POST - /api/evidencias/{idEvidencia}/custodia/analisar?idUsuarioLogado={idUsuarioLogado}
    @PostMapping("/analisar")
    public ResponseEntity<HistoricoCustodia> analisar(@PathVariable Long idEvidencia, @RequestParam Long idUsuarioLogado, @RequestBody JustificativaDTO dto) {
        return ResponseEntity.ok(historicoCustodiaService.registrarAnalise(idEvidencia, idUsuarioLogado, dto.justificativa()));
    }
    
    // POST - /api/evidencias/{idEvidencia}/custodia/devolver?idUsuarioLogado={idUsuarioLogado}
    @PostMapping("/devolver")
    public ResponseEntity<HistoricoCustodia> devolver(@PathVariable Long idEvidencia, @RequestParam Long idUsuarioLogado, @RequestBody JustificativaDTO dto) {
        return ResponseEntity.ok(historicoCustodiaService.registrarDevolucao(idEvidencia, idUsuarioLogado, dto.justificativa()));
    }
    
    // POST - /api/evidencias/{idEvidencia}/custodia/descartar?idUsuarioLogado={idUsuarioLogado}
    @PostMapping("/descartar")
    public ResponseEntity<HistoricoCustodia> descartar(@PathVariable Long idEvidencia, @RequestParam Long idUsuarioLogado, @RequestBody JustificativaDTO dto) {
        return ResponseEntity.ok(historicoCustodiaService.registrarDescarte(idEvidencia, idUsuarioLogado, dto.justificativa()));
    }

}
