package com.camilly.forense.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import com.camilly.forense.api.dto.AlertaRequest;

@RestController
@RequestMapping("/api/notificacoes")
public class NotificacaoController {
    private static final Map<Long, List<String>> NOTIFICACOES = new ConcurrentHashMap<>();

    // POST - /api/notificacoes/admin
    @PostMapping("/admin")
    public ResponseEntity<?> alertaGlobal(@RequestBody AlertaRequest request) {
        String msg = "ALERTA GLOBAL: " + request.mensagem();
        NOTIFICACOES.computeIfAbsent(-1L, k -> new ArrayList<>()).add(msg);

        return ResponseEntity.ok(Map.of("status", "ok", "tipo", "global"));
    }

    // Alerta de caso específico
    // POST - /api/notificacoes/caso/{idCaso}
    @PostMapping("/caso/{idCaso}")
    public ResponseEntity<?> alertaCaso(@PathVariable Long idCaso, @RequestBody AlertaRequest request) {
        String msg = "CASO " + idCaso + ": " + request.mensagem();
        NOTIFICACOES.computeIfAbsent(idCaso, k -> new ArrayList<>()).add(msg);

        return ResponseEntity.ok(Map.of("status", "ok", "casoId", idCaso));
    }

    // Consulta notificações do caso
    // GET - /api/notificacao/caso/{idCaso}
    @GetMapping("/caso/{idCaso}")
    public ResponseEntity<?> listar(@PathVariable Long idCaso) {
        return ResponseEntity
                .ok(Map.of("casoId", idCaso, "notificacoes", NOTIFICACOES.getOrDefault(idCaso, List.of())));
    }

}
