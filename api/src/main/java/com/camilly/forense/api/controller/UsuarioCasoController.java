package com.camilly.forense.api.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.List;

import com.camilly.forense.api.model.UsuarioCaso;
import com.camilly.forense.api.model.enums.PapelCaso;
import com.camilly.forense.api.service.UsuarioCasoService;

@RestController
@RequestMapping("/api/casos/{idCaso}/usuarios")
@RequiredArgsConstructor
public class UsuarioCasoController {
    private final UsuarioCasoService usuarioCasoService;

    // POST - /api/casos/{idCaso}/usuarios?idUsuario={idUsuario}&papel={papel}
    @PostMapping("")
    public ResponseEntity<UsuarioCaso> vincularUsuario(@PathVariable Long idCaso, @RequestParam Long idUsuario, @RequestParam PapelCaso papel) {
        UsuarioCaso vinculo = usuarioCasoService.vincularUsuarioAoCaso(idUsuario, idCaso, papel);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(vinculo);
    }

    // DELETE - /api/casos/{idCaso}/usuarios/{idUsuario}
    @DeleteMapping("/{idUsuario}")
    public ResponseEntity<Void> desvincularUsuario(@PathVariable Long idCaso, @PathVariable Long idUsuario) {
        usuarioCasoService.desvincularUsuario(idUsuario, idCaso);
        return ResponseEntity.noContent().build();
    }

    // GET - /api/casos/{idCaso}/usuarios
    @GetMapping("")
    public ResponseEntity<List<UsuarioCaso>> listarEnvolvidos(@PathVariable Long idCaso) {
        return ResponseEntity.ok(usuarioCasoService.listarEnvolvidosNoCaso(idCaso));
    }
    
}
