package com.camilly.forense.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

import com.camilly.forense.api.model.Evidencia;

public interface EvidenciaRepository extends JpaRepository<Evidencia, Long> {
    List<Evidencia> findByCasoId(Long idCaso);
    Optional<Evidencia> findByHashSha256(String hashSha256);
}
