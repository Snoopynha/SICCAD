package com.camilly.forense.api.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

import com.camilly.forense.api.model.*;
import com.camilly.forense.api.model.enums.PapelCaso;
import com.camilly.forense.api.repository.UsuarioCasoRepository;

@Service
@RequiredArgsConstructor
public class UsuarioCasoService {
    private final UsuarioCasoRepository usuarioCasoRepository;
    private final UsuarioService usuarioService;
    private final CasoService casoService;

    @Transactional
    public UsuarioCaso vincularUsuarioAoCaso(Long idUsuario, Long idCaso, PapelCaso papel) {
        Usuario usuario = usuarioService.buscarPorId(idUsuario);
        Caso caso = casoService.buscarPorId(idCaso);

        if (usuarioCasoRepository.findByUsuarioIdAndCasoId(idUsuario, idCaso).isPresent()) {
            throw new RuntimeException("Este usuario já está vinculado ao caso");
        }

        UsuarioCasoId chaveComposta = new UsuarioCasoId();
        chaveComposta.setIdUsuario(idUsuario);
        chaveComposta.setIdCaso(idCaso);

        UsuarioCaso vinculo = new UsuarioCaso();
        vinculo.setId(chaveComposta);
        vinculo.setUsuario(usuario);
        vinculo.setCaso(caso);
        vinculo.setPapelNoCaso(papel);
        vinculo.setDataAtribuicao(LocalDateTime.now());

        return usuarioCasoRepository.save(vinculo);
    }

    public boolean temPermissao(Long idUsuario, Long idCaso) {
        return usuarioCasoRepository.findByUsuarioIdAndCasoId(idUsuario, idCaso).isPresent();
    }

    public List<UsuarioCaso> listarEnvolvidosNoCaso(Long idCaso) {
        return usuarioCasoRepository.findByCasoId(idCaso);
    }
}
