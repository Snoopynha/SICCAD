package com.camilly.forense.api.dto;

import java.time.LocalDateTime;

public record HistoricoCustodiaResponse(
    String acao,
    String descricaoAcao,
    String custodianteAnterior,
    String custodiantePosterior,
    LocalDateTime dataHora,
    String justificativa,
    String hashEvidencia,
    String hashAuditoria
) {

}
