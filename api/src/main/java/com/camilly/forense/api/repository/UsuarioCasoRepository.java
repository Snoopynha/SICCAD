package com.camilly.forense.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

import com.camilly.forense.api.model.UsuarioCaso;
import com.camilly.forense.api.model.UsuarioCasoId;

public interface UsuarioCasoRepository extends JpaRepository<UsuarioCaso, UsuarioCasoId> {
    Optional<UsuarioCaso> findByUsuarioIdAndCasoId(Long idUsuario, Long idCaso);
    List<UsuarioCaso> findByCasoIdAndAtivoTrue(Long idCaso);
}
