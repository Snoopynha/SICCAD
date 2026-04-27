package com.camilly.forense.api.service;

import java.util.Arrays;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import com.camilly.forense.api.model.Caso;
import com.camilly.forense.api.model.Usuario;
import com.camilly.forense.api.model.UsuarioCaso;
import com.camilly.forense.api.model.enums.PapelCaso;
import com.camilly.forense.api.model.enums.TipoUsuario;
import com.camilly.forense.api.repository.UsuarioRepository;
import com.camilly.forense.api.controller.exception.RegraDeNegocioException;

@Service
@RequiredArgsConstructor
public class AutorizacaoService {
    private final UsuarioRepository usuarioRepository;

    public void validarAcessoAoCaso(Caso caso, Long idUsuarioLogado) {
        Usuario usuario = usuarioRepository.findById(idUsuarioLogado).orElseThrow(() -> new RegraDeNegocioException("Usuário não encontrado"));
        if (usuario.getTipoGlobal() == TipoUsuario.ADMIN) return;

        boolean isEnvolvido = caso.getUsuarios().stream().anyMatch(uc -> uc.getUsuario().getId().equals(idUsuarioLogado));

        if (!isEnvolvido) {
            throw new RegraDeNegocioException("Você não tem permissão para acessar este caso");
        }
    }

    public void validarPapelNoCaso(Caso caso, Long idUsuarioLogado, PapelCaso... papeisPermitidos) {
        Usuario usuario = buscarUsuario(idUsuarioLogado);
        if (usuario.getTipoGlobal() == TipoUsuario.ADMIN) return;

        // Busca o vínculo específico do usuário com este caso
        UsuarioCaso vinculo = caso.getUsuarios().stream().filter(uc -> uc.getUsuario().getId().equals(idUsuarioLogado) && uc.getAtivo()).findFirst().orElseThrow(() -> new RegraDeNegocioException("Acesso negado: você não tem vínculo ativo com este caso"));

        // Verifica se o papel do usuário está na lista de papéis que podem fazer a ação
        boolean temPermissao = Arrays.asList(papeisPermitidos).contains(vinculo.getPapelNoCaso());

        if (!temPermissao) {
            throw new RegraDeNegocioException("Acesso negado: seu papel de " + vinculo.getPapelNoCaso() + " não permite realizar esta operação");
        }
    }

    private Usuario buscarUsuario(Long id) {
        return usuarioRepository.findById(id).orElseThrow(() -> new RegraDeNegocioException("Usuário não encontrado"));
    }
    
}
