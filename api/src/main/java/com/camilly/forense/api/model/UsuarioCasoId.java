package com.camilly.forense.api.model;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import lombok.Data;

@Data
@Embeddable
public class UsuarioCasoId implements Serializable {
    private Long idUsuario;
    private Long idCaso;
}
