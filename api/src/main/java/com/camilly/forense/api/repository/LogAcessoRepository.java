package com.camilly.forense.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.camilly.forense.api.model.LogAcesso;

public interface LogAcessoRepository extends JpaRepository<LogAcesso, Long> {
    
}
