package com.camilly.forense.api.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.List;

import com.camilly.forense.api.dto.LoginDTO;
import com.camilly.forense.api.model.Usuario;
import com.camilly.forense.api.model.UsuarioCaso;
import com.camilly.forense.api.service.UsuarioCasoService;
import com.camilly.forense.api.service.UsuarioService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {
    private final UsuarioService usuarioService;
    private final UsuarioCasoService usuarioCasoService;

    // POST - /api/usuarios
    @PostMapping("")
    public ResponseEntity<Usuario> criarUsuario(@Valid @RequestBody Usuario usuario) {
        Usuario usuarioCriado = usuarioService.criarUsuario(usuario);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioCriado);
    }

    // POST - /api/usuarios/login
    @PostMapping("/login")
    public ResponseEntity<Usuario> login(@Valid @RequestBody LoginDTO login) {
        return ResponseEntity.ok(usuarioService.autenticar(login.email(), login.senha()));
    }
    
    // GET - /api/usuarios/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.buscarPorId(id));
    }
    
    // GET - /api/usuarios
    @GetMapping("")
    public ResponseEntity<List<Usuario>> listarTodos() {
        return ResponseEntity.ok(usuarioService.listarTodos());
    }

    // GET - /api/usuarios/{id}/casos
    @GetMapping("/{id}/casos")
    public ResponseEntity<List<UsuarioCaso>> listarMeusCasos(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioCasoService.listarCasosDoUsuario(id));
    }

}
