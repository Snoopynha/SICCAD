package com.camilly.forense.api.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.List;

import com.camilly.forense.api.model.Caso;
import com.camilly.forense.api.model.enums.StatusCaso;
import com.camilly.forense.api.service.CasoService;
import com.camilly.forense.api.service.UsuarioCasoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/casos")
@RequiredArgsConstructor
public class CasoController {
    private final CasoService casoService;
    private final UsuarioCasoService usuarioCasoService;

    // POST - /api/casos
    @PostMapping("")
    public ResponseEntity<Caso> criar(@Valid @RequestBody Caso caso, @RequestHeader("X-User-Id") Long idUsuarioLogado) {
        Caso casoCriado = casoService.criar(caso);
        usuarioCasoService.vincularCriadorAoCaso(idUsuarioLogado, casoCriado.getId());

        return ResponseEntity.status(HttpStatus.CREATED).body(casoCriado);
    }

    // GET - /api/casos/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Caso> buscarPorId(@PathVariable Long id, @RequestHeader("X-User-Id") Long idUsuarioLogado) {
        return ResponseEntity.ok(casoService.buscarPorId(id, idUsuarioLogado));
    }
    
    // GET - /api/casos
    @GetMapping("")
    public ResponseEntity<List<Caso>> listarMeusCasos(@RequestHeader("X-User-Id") Long idUsuarioLogado, @RequestParam(required = false) StatusCaso status) {
        if (status != null) return ResponseEntity.ok(casoService.listarMeusCasosPorStatus(idUsuarioLogado, status));
        
        return ResponseEntity.ok(casoService.listarMeusCasos(idUsuarioLogado));
    }

    // PATCH - /api/casos/{id}/iniciar-pericia
    @PatchMapping("/{id}/iniciar-pericia")
    public ResponseEntity<Caso> iniciarPericia(@PathVariable Long id, @RequestHeader("X-User-Id") Long idUsuarioLogado) {
        return ResponseEntity.ok(casoService.iniciarPericia(id, idUsuarioLogado));
    }
    
    // PATCH - /api/casos/{id}/concluir
    @PatchMapping("/{id}/concluir")
    public ResponseEntity<Caso> concluirCaso(@PathVariable Long id, @RequestHeader("X-User-Id") Long idUsuarioLogado) {
        return ResponseEntity.ok(casoService.concluirCaso(id, idUsuarioLogado));
    }

    // PATCH - /api/casos/{id}/arquivar
    @PatchMapping("/{id}/arquivar")
    public ResponseEntity<Caso> arquivarCaso(@PathVariable Long id, @RequestHeader("X-User-Id") Long idUsuarioLogado) {
        return ResponseEntity.ok(casoService.arquivarCaso(id, idUsuarioLogado));
    }

    // PATCH - /api/casos/{id}/reabrir
    @PatchMapping("/{id}/reabrir")
    public ResponseEntity<Caso> reabrirCaso(@PathVariable Long id, @RequestHeader("X-User-Id") Long idUsuarioLogado) {
        return ResponseEntity.ok(casoService.reabrirCaso(id, idUsuarioLogado));
    }

}
