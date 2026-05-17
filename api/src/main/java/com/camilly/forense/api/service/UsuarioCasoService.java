package com.camilly.forense.api.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

import com.camilly.forense.api.controller.exception.RecursoNaoEncontradoException;
import com.camilly.forense.api.controller.exception.RegraDeNegocioException;
import com.camilly.forense.api.dto.UsuarioCasoResponse;
import com.camilly.forense.api.model.*;
import com.camilly.forense.api.model.enums.PapelCaso;
import com.camilly.forense.api.repository.CasoRepository;
import com.camilly.forense.api.repository.UsuarioCasoRepository;

@Service
@RequiredArgsConstructor
public class UsuarioCasoService {
    private final UsuarioCasoRepository usuarioCasoRepository;
    private final UsuarioService usuarioService;
    private final CasoRepository casoRepository;
    private final AutorizacaoService autorizacaoService;

    @Transactional
    public UsuarioCasoResponse vincularUsuarioAoCaso(Long idUsuario, Long idCaso, PapelCaso papel, Long idUsuarioLogado) {
        Caso caso = casoRepository.findById(idCaso).orElseThrow(() -> new RecursoNaoEncontradoException("Caso não encontrado"));
        autorizacaoService.validarPapelNoCaso(caso, idUsuarioLogado, PapelCaso.DELEGADO);
        
        if (!idUsuario.equals(idUsuarioLogado)) {
            autorizacaoService.validarAcessoAoCaso(caso, idUsuarioLogado);
        }

        if (usuarioCasoRepository.findByUsuarioIdAndCasoId(idUsuario, idCaso).isPresent()) {
            throw new RegraDeNegocioException("Este usuario já está vinculado ao caso");
        }

        Usuario usuario = usuarioService.buscarUsuarioCompletoPorId(idUsuario);

        UsuarioCasoId chaveComposta = new UsuarioCasoId();
        chaveComposta.setIdUsuario(idUsuario);
        chaveComposta.setIdCaso(idCaso);

        UsuarioCaso vinculo = new UsuarioCaso();
        vinculo.setId(chaveComposta);
        vinculo.setUsuario(usuario);
        vinculo.setCaso(caso);
        vinculo.setPapelNoCaso(papel);
        vinculo.setDataAtribuicao(LocalDateTime.now());
        vinculo.setAtivo(true);

        return toResponse(usuarioCasoRepository.save(vinculo));
    }

    @Transactional
    public void vincularCriadorAoCaso(Long idUsuario, Long idCaso) {
        Caso caso = casoRepository.findById(idCaso)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Caso não encontrado"));
        Usuario usuario = usuarioService.buscarUsuarioCompletoPorId(idUsuario);

        UsuarioCasoId chaveComposta = new UsuarioCasoId();
        chaveComposta.setIdUsuario(idUsuario);
        chaveComposta.setIdCaso(idCaso);

        UsuarioCaso vinculo = new UsuarioCaso();
        vinculo.setId(chaveComposta);
        vinculo.setUsuario(usuario);
        vinculo.setCaso(caso);
        vinculo.setPapelNoCaso(PapelCaso.DELEGADO); // Criador sempre entra como Delegado
        vinculo.setDataAtribuicao(LocalDateTime.now());
        vinculo.setAtivo(true);

        usuarioCasoRepository.save(vinculo);
    }

    @Transactional
    public void desvincularUsuario(Long idUsuario, Long idCaso, Long idUsuarioLogado) {
        Caso caso = casoRepository.findById(idCaso).orElseThrow(() -> new RecursoNaoEncontradoException("Caso não encontrado"));
        autorizacaoService.validarPapelNoCaso(caso, idUsuarioLogado, PapelCaso.DELEGADO);

        UsuarioCaso vinculo = usuarioCasoRepository.findByUsuarioIdAndCasoId(idUsuario, idCaso).orElseThrow(() -> new RecursoNaoEncontradoException("Não foi encontrado vínculo deste usuário com o caso"));
        vinculo.setAtivo(false);

        usuarioCasoRepository.save(vinculo);
    }

    public List<UsuarioCasoResponse> listarEnvolvidosNoCaso(Long idCaso, Long idUsuarioLogado) {
        Caso caso = casoRepository.findById(idCaso).orElseThrow(() -> new RecursoNaoEncontradoException("Caso não encontrado"));
        
        autorizacaoService.validarAcessoAoCaso(caso, idUsuarioLogado);
        return usuarioCasoRepository.findByCasoIdAndAtivoTrue(idCaso).stream().map(this::toResponse).toList();
    }

    private UsuarioCasoResponse toResponse(UsuarioCaso usuario) {
        return new UsuarioCasoResponse(
            usuario.getUsuario().getId(),
            usuario.getUsuario().getNome(),
            usuario.getUsuario().getEmail(),
            usuario.getPapelNoCaso(),
            usuario.getDataAtribuicao(),
            usuario.getAtivo()
        );
    }

}
