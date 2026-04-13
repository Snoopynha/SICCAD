package com.camilly.forense.api.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

import com.camilly.forense.api.controller.exception.RegraDeNegocioException;
import com.camilly.forense.api.model.Caso;
import com.camilly.forense.api.model.enums.StatusCaso;
import com.camilly.forense.api.repository.CasoRepository;   

@Service
@RequiredArgsConstructor
public class CasoService {
    private final CasoRepository casoRepository;

    public Caso criarCaso(Caso caso) {
        caso.setStatus(StatusCaso.ABERTO);
        caso.setDataAbertura(LocalDateTime.now());

        return casoRepository.save(caso);
    }

    public Caso buscarPorId(Long id) {
        return casoRepository.findById(id).orElseThrow(() -> new RuntimeException("Não há caso com o ID: " + id));
    }

    public List<Caso> listarTodos() {
        return casoRepository.findAll();
    }

    public List<Caso> listarPorStatus(StatusCaso status) {
        return casoRepository.findByStatus(status);
    }

    public Caso atualizarStatus(Long id, StatusCaso novoStatus) {
        Caso caso = buscarPorId(id);
        
        validarTransicao(caso.getStatus(), novoStatus);
        caso.setStatus(novoStatus);

        return casoRepository.save(caso);
    }

    public Caso iniciarPericia(Long id) {
        return atualizarStatus(id, StatusCaso.EM_PERICIA);
    }

    public Caso concluirCaso(Long id) {
        return atualizarStatus(id, StatusCaso.CONCLUIDO);
    }

    public Caso arquivarCaso(Long id) {
        return atualizarStatus(id, StatusCaso.ARQUIVADO);
    }

    // Métodos auxiliares
    private void validarTransicao(StatusCaso atual, StatusCaso novo) {
        // ABERTO → EM_PERICIA
        if (atual == StatusCaso.ABERTO && novo == StatusCaso.EM_PERICIA) return;
        // EM_PERICIA → CONCLUIDO
        if (atual == StatusCaso.EM_PERICIA && novo == StatusCaso.CONCLUIDO) return;
        // CONCLUIDO → ARQUIVADO
        if (atual == StatusCaso.CONCLUIDO && novo == StatusCaso.ARQUIVADO) return;
        // Se não for nenhuma das válidas → erro
        throw new RegraDeNegocioException("Transição inválida de " + atual + " para " + novo);
    }
}
