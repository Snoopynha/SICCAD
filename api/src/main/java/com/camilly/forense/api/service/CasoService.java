package com.camilly.forense.api.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

import com.camilly.forense.api.controller.exception.RecursoNaoEncontradoException;
import com.camilly.forense.api.controller.exception.RegraDeNegocioException;
import com.camilly.forense.api.model.Caso;
import com.camilly.forense.api.model.Usuario;
import com.camilly.forense.api.model.enums.PapelCaso;
import com.camilly.forense.api.model.enums.StatusCaso;
import com.camilly.forense.api.model.enums.TipoUsuario;
import com.camilly.forense.api.repository.CasoRepository;
import com.camilly.forense.api.repository.UsuarioRepository;

import jakarta.transaction.Transactional;   

@Service
@RequiredArgsConstructor
public class CasoService {
    private final CasoRepository casoRepository;
    private final UsuarioRepository usuarioRepository;
    private final AutorizacaoService autorizacaoService;

    @Transactional
    public Caso criar(Caso caso) {
        caso.setStatus(StatusCaso.ABERTO);
        caso.setDataAbertura(LocalDateTime.now());

        return casoRepository.save(caso);
    }

    public Caso buscarPorId(Long id, Long idUsuarioLogado) {
        Caso caso = casoRepository.findById(id).orElseThrow(() -> new RecursoNaoEncontradoException("Caso não encontrado"));
        autorizacaoService.validarAcessoAoCaso(caso, idUsuarioLogado);

        return caso;
    }

    public List<Caso> listarMeusCasos(Long idUsuarioLogado) {
        Usuario usuario = usuarioRepository.findById(idUsuarioLogado).orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado"));

        if(usuario.getTipoGlobal() == TipoUsuario.ADMIN) {
            return casoRepository.findAll();
        }

        return casoRepository.findByUsuarioId(idUsuarioLogado);
    }

    public List<Caso> listarMeusCasosPorStatus(Long idUsuarioLogado, StatusCaso status) {
        Usuario usuario = usuarioRepository.findById(idUsuarioLogado).orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado"));

        if(usuario.getTipoGlobal() == TipoUsuario.ADMIN){
            return casoRepository.findByStatus(status);
        }
        
        return casoRepository.findByUsuarioIdAndStatus(idUsuarioLogado, status);
    }

    public Caso atualizarStatus(Long id, StatusCaso novoStatus, Long idUsuarioLogado) {
        Caso caso = buscarPorId(id, idUsuarioLogado);

        if (novoStatus == StatusCaso.CONCLUIDO || novoStatus == StatusCaso.ARQUIVADO || novoStatus == StatusCaso.ABERTO) {
            autorizacaoService.validarPapelNoCaso(caso, idUsuarioLogado, PapelCaso.DELEGADO);
        }
        
        if (novoStatus == StatusCaso.EM_PERICIA) {
            autorizacaoService.validarPapelNoCaso(caso, idUsuarioLogado, PapelCaso.DELEGADO, PapelCaso.PERITO);
        }
        
        validarTransicao(caso.getStatus(), novoStatus);
        caso.setStatus(novoStatus);
 
        return casoRepository.save(caso);
    }

    public Caso iniciarPericia(Long id, Long idUsuarioLogado) {
        return atualizarStatus(id, StatusCaso.EM_PERICIA, idUsuarioLogado);
    }

    public Caso concluirCaso(Long id, Long idUsuarioLogado) {
        return atualizarStatus(id, StatusCaso.CONCLUIDO, idUsuarioLogado);
    }

    public Caso arquivarCaso(Long id, Long idUsuarioLogado) {
        return atualizarStatus(id, StatusCaso.ARQUIVADO, idUsuarioLogado);
    }

    public Caso reabrirCaso(Long id, Long idUsuarioLogado) {
        return atualizarStatus(id, StatusCaso.ABERTO, idUsuarioLogado);
    }

    // Métodos auxiliares
    private void validarTransicao(StatusCaso atual, StatusCaso novo) {
        // ABERTO → EM_PERICIA
        if (atual == StatusCaso.ABERTO && novo == StatusCaso.EM_PERICIA) return;
        // EM_PERICIA → CONCLUIDO
        if (atual == StatusCaso.EM_PERICIA && novo == StatusCaso.CONCLUIDO) return;
        // CONCLUIDO → ARQUIVADO
        if (atual == StatusCaso.CONCLUIDO && novo == StatusCaso.ARQUIVADO) return;
        // ARQUIVADO → ABERTO
        if(atual == StatusCaso.ARQUIVADO && novo == StatusCaso.ABERTO) return;
        // Se não for nenhuma das válidas → erro
        throw new RegraDeNegocioException("Transição inválida de " + atual + " para " + novo);
    }
    
}
