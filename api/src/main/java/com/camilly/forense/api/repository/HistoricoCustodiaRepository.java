package com.camilly.forense.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

import com.camilly.forense.api.model.HistoricoCustodia;
import com.camilly.forense.api.model.enums.AcaoCustodia;

public interface HistoricoCustodiaRepository extends JpaRepository<HistoricoCustodia, Long> {
    List<HistoricoCustodia> findByEvidenciaIdOrderByDataHoraAsc(Long idEvidencia);
    HistoricoCustodia findTopByEvidenciaIdOrderByDataHoraDesc(Long idEvidencia);
    HistoricoCustodia findTopByEvidenciaIdAndAcaoInOrderByDataHoraDesc(Long idEvidencia, List<AcaoCustodia> acoes);
}
