package com.camilly.forense.api.dto;

import org.hibernate.validator.constraints.br.CPF;

import com.camilly.forense.api.model.enums.CargoUsuario;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UsuarioRequest(
    @NotBlank(message = "O nome é obrigatório")
    String nome,

    @NotBlank(message = "O CPF é obrigatório")
    @CPF(message = "CPF inválido")
    String cpf,

    @NotBlank(message = "O email é obrigatório")
    @Email(message = "Formato de email inválido")
    String email,

    @NotBlank(message = "A senha é obrigatória")
    String senha,

    CargoUsuario cargo
) {
    
}
