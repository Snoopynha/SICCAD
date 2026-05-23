package com.camilly.forense.api.dto;

public record LoginResponse(
    Long id,
    String nome,
    String tipo_global,
    String mensagem
) {

} 
