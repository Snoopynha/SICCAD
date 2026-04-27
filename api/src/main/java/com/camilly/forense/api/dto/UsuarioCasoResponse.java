package com.camilly.forense.api.dto;

import java.time.LocalDateTime;
import com.camilly.forense.api.model.enums.PapelCaso;

public record UsuarioCasoResponse(
    Long idUsuario,
    String nomeUsuario,
    String emailUsuario,
    PapelCaso papelNoCaso,
    LocalDateTime dataAtribuicao,
    Boolean ativo
) {

}
