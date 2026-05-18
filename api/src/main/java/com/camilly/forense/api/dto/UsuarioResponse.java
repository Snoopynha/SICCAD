package com.camilly.forense.api.dto;

public record UsuarioResponse(
    Long id,
    String nome,
    String email,
    String cargo
) {
    
}
