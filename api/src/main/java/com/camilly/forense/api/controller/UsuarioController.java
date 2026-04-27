package com.camilly.forense.api.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.List;

import com.camilly.forense.api.dto.LoginRequest;
import com.camilly.forense.api.dto.LoginResponse;
import com.camilly.forense.api.dto.UsuarioRequest;
import com.camilly.forense.api.dto.UsuarioResponse;
import com.camilly.forense.api.service.UsuarioService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {
    private final UsuarioService usuarioService;

    // POST - /api/usuarios
    @PostMapping("")
    public ResponseEntity<UsuarioResponse> criar(@Valid @RequestBody UsuarioRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.criar(request));
    }

    // POST - /api/usuarios/autenticar
    @PostMapping("/autenticar")
    public ResponseEntity<LoginResponse> autenticar(@Valid @RequestBody LoginRequest login) {
        return ResponseEntity.ok(usuarioService.autenticar(login));
    }
    
    // GET - /api/usuarios/{id}
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.buscarPorId(id));
    }
    
    // GET - /api/usuarios
    @GetMapping("")
    public ResponseEntity<List<UsuarioResponse>> listar() {
        return ResponseEntity.ok(usuarioService.listar());
    }

}
