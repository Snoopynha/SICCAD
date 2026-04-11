package com.camilly.forense.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

import com.camilly.forense.api.model.Caso;
import com.camilly.forense.api.model.enums.StatusCaso;

public interface CasoRepository extends JpaRepository<Caso, Long> {
    Optional<Caso> findByNumeroProcesso(String numeroProcesso);
    List<Caso> findByStatus(StatusCaso status);
}
