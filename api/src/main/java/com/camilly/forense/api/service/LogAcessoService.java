package com.camilly.forense.api.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.time.LocalDateTime;

import com.camilly.forense.api.model.LogAcesso;
import com.camilly.forense.api.repository.LogAcessoRepository;
import com.camilly.forense.api.repository.UsuarioRepository;
import com.camilly.forense.api.model.Usuario;

@Service
@RequiredArgsConstructor
public class LogAcessoService {
    private final LogAcessoRepository logAcessoRepository;
    private final UsuarioRepository usuarioRepository;

    public void registrarAcesso(Long idUsuario, String idSessao, String ipOrigem, String endpointAcessado, boolean sucesso) {
        LogAcesso log = new LogAcesso();

        if (idUsuario != null) {
            Usuario usuarioRef = usuarioRepository.getReferenceById(idUsuario);
            log.setUsuario(usuarioRef);
        }

        log.setIdSessao(idSessao);
        log.setIpOrigem(ipOrigem);
        log.setEndpointAcessado(endpointAcessado);
        log.setTimestamp(LocalDateTime.now());
        log.setAnomalia(false);
        log.setSucesso(sucesso);

        logAcessoRepository.save(log);
    }
}
