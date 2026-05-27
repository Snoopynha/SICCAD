package com.camilly.forense.api.model;

import java.util.List;

import org.hibernate.validator.constraints.br.CPF;

import com.camilly.forense.api.model.enums.CargoUsuario;
import com.camilly.forense.api.model.enums.TipoUsuario;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Entity
@Table(name = "usuario")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "O nome é obrigatório")
    @Column(nullable = false, length = 150)
    private String nome;

    @JsonIgnore
    @NotBlank(message = "O CPF é obrigatório")
    @CPF(message = "CPF inválido")
    @Column(nullable = false, unique = true, length = 14)
    private String cpf;

    @NotBlank(message = "O email é obrigatório")
    @Email(message = "Formato de email inválido")
    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @JsonIgnore
    @NotBlank(message = "Insira sua senha")
    @Column(name = "senha_hash", nullable = false)
    private String senhaHash;

    @JsonIgnore
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_global")
    private TipoUsuario tipoGlobal = TipoUsuario.PADRAO;

    @Enumerated(EnumType.STRING)
    @Column(name = "cargo")
    private CargoUsuario cargo;


    @JsonIgnore
    @OneToMany(mappedBy = "usuario")
    private List<UsuarioCaso> casos;
}
