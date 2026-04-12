package com.camilly.forense.api.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

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
        Caso casoExistente = buscarPorId(id);
        casoExistente.setStatus(novoStatus);

        return casoRepository.save(casoExistente);
    }
}
