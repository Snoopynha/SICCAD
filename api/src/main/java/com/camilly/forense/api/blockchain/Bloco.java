package com.camilly.forense.api.blockchain;

import lombok.Data;

@Data
public class Bloco {
    private int index;
    private Long timestamp;
    private Long idEvidencia;
    private String hashEvidencia;
    private String idUsuarioCriptografado;
    private int idAcao; // 1 = Upload, 2 = Transferência, 3 = Análise etc...
    private String hashAnterior;
    private String hashDoBloco;
}
