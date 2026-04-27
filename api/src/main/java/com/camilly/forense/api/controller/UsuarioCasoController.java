package com.camilly.forense.api.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.List;

import com.camilly.forense.api.dto.UsuarioCasoResponse;
import com.camilly.forense.api.model.enums.PapelCaso;
import com.camilly.forense.api.service.UsuarioCasoService;

@RestController
@RequestMapping("/api/casos/{idCaso}/participantes")
@RequiredArgsConstructor
public class UsuarioCasoController {
    private final UsuarioCasoService usuarioCasoService;

    // POST - /api/casos/{idCaso}/participantes?idUsuario={idUsuario}&papel={papel}
    @PostMapping("")
    public ResponseEntity<UsuarioCasoResponse> vincularUsuario(@PathVariable Long idCaso, @RequestParam Long idUsuario, @RequestParam PapelCaso papel, @RequestHeader("X-User-Id") Long idUsuarioLogado) {
        UsuarioCasoResponse vinculo = usuarioCasoService.vincularUsuarioAoCaso(idUsuario, idCaso, papel, idUsuarioLogado);
        return ResponseEntity.status(HttpStatus.CREATED).body(vinculo);
    }

    // DELETE - /api/casos/{idCaso}/participantes/{idUsuario}
    @DeleteMapping("/{idUsuario}")
    public ResponseEntity<Void> desvincularUsuario(@PathVariable Long idCaso, @PathVariable Long idUsuario, @RequestHeader("X-User-Id") Long idUsuarioLogado) {
        usuarioCasoService.desvincularUsuario(idUsuario, idCaso, idUsuarioLogado);
        return ResponseEntity.noContent().build();
    }

    // GET - /api/casos/{idCaso}/participantes
    @GetMapping("")
    public ResponseEntity<List<UsuarioCasoResponse>> listarEnvolvidos(@PathVariable Long idCaso, @RequestHeader("X-User-Id") Long idUsuarioLogado) {
        return ResponseEntity.ok(usuarioCasoService.listarEnvolvidosNoCaso(idCaso, idUsuarioLogado));
    }
    
}
