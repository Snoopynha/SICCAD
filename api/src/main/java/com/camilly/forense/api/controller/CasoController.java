package com.camilly.forense.api.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.List;

import com.camilly.forense.api.model.Caso;
import com.camilly.forense.api.model.enums.PapelCaso;
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

    // POST - /api/casos?idUsuarioLogado={id}
    @PostMapping("")
    public ResponseEntity<Caso> criarCaso(@Valid @RequestBody Caso caso, @RequestParam Long idUsuarioLogado) {
        Caso casoCriado = casoService.criarCaso(caso);
        usuarioCasoService.vincularUsuarioAoCaso(idUsuarioLogado, casoCriado.getId(), PapelCaso.DELEGADO);

        return ResponseEntity.status(HttpStatus.CREATED).body(casoCriado);
    }

    // GET - /api/casos/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Caso> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(casoService.buscarPorId(id));
    }
    
    // GET - /api/casos
    @GetMapping("")
    public ResponseEntity<List<Caso>> listarCasos(@RequestParam(required = false) StatusCaso status) {
        if (status != null) return ResponseEntity.ok(casoService.listarPorStatus(status));
        
        return ResponseEntity.ok(casoService.listarTodos());
    }

    // PATCH - /api/casos/{id}/iniciar-pericia
    @PatchMapping("/{id}/iniciar-pericia")
    public ResponseEntity<Caso> iniciarPericia(@PathVariable Long id) {
        return ResponseEntity.ok(casoService.iniciarPericia(id));
    }
    
    // PATCH - /api/casos/{id}/concluir
    @PatchMapping("/{id}/concluir")
    public ResponseEntity<Caso> concluirCaso(@PathVariable Long id) {
        return ResponseEntity.ok(casoService.concluirCaso(id));
    }

    // PATCH - /api/casos/{id}/arquivar
    @PatchMapping("/{id}/arquivar")
    public ResponseEntity<Caso> arquivarCaso(@PathVariable Long id) {
        return ResponseEntity.ok(casoService.arquivarCaso(id));
    }

}
