package com.camilly.forense.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.List;

import com.camilly.forense.api.model.Caso;
import com.camilly.forense.api.model.enums.StatusCaso;

public interface CasoRepository extends JpaRepository<Caso, Long> {
    Optional<Caso> findByNumeroProcesso(String numeroProcesso);
    List<Caso> findByStatus(StatusCaso status);
    @Query("SELECT c FROM Caso c JOIN c.usuarios uc WHERE uc.usuario.id = :usuarioId")
    List<Caso> findByUsuarioId(@Param("usuarioId") Long usuarioId);
    @Query("SELECT c FROM Caso c JOIN c.usuarios uc WHERE uc.usuario.id = :usuarioId AND c.status = :status")
    List<Caso> findByUsuarioIdAndStatus(@Param("usuarioId") Long usuarioId, @Param("status") StatusCaso status);
}
