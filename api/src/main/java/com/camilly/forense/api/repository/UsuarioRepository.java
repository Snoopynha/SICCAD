package com.camilly.forense.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

import com.camilly.forense.api.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    Optional<Usuario> findByCpf(String cpf);
}
