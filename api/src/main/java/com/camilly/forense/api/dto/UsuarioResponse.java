package com.camilly.forense.api.dto;

import com.camilly.forense.api.model.enums.CargoUsuario;

public record UsuarioResponse(
    Long id,
    String nome,
    String email,
    CargoUsuario cargo
) {
}