package com.camilly.forense.api.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.camilly.forense.api.controller.exception.RecursoNaoEncontradoException;
import com.camilly.forense.api.controller.exception.RegraDeNegocioException;
import com.camilly.forense.api.dto.LoginRequest;
import com.camilly.forense.api.dto.LoginResponse;
import com.camilly.forense.api.dto.UsuarioRequest;
import com.camilly.forense.api.dto.UsuarioResponse;
import com.camilly.forense.api.model.Usuario;
import com.camilly.forense.api.model.enums.TipoUsuario;
import com.camilly.forense.api.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioResponse criar(UsuarioRequest request) {

        if (usuarioRepository.findByCpf(request.cpf()).isPresent()) {
            throw new RegraDeNegocioException("Já existe um usuário com esse CPF");
        }

        if (usuarioRepository.findByEmail(request.email()).isPresent()) {
            throw new RegraDeNegocioException("Já existe um usuário com esse email");
        }

        Usuario usuario = new Usuario();

        usuario.setNome(request.nome());
        usuario.setCpf(request.cpf());
        usuario.setEmail(request.email());

        usuario.setSenhaHash(
            passwordEncoder.encode(request.senha())
        );

        // REGRA CORRETA
        usuario.setTipoGlobal(TipoUsuario.PADRAO);

        // cargo vem direto como ENUM
        usuario.setCargo(request.cargo());

        Usuario salvo = usuarioRepository.save(usuario);

        return new UsuarioResponse(
            salvo.getId(),
            salvo.getNome(),
            salvo.getEmail(),
            salvo.getCargo()
        );
    }

    public LoginResponse autenticar(LoginRequest request) {

        Usuario usuario = usuarioRepository
            .findByEmail(request.email())
            .orElseThrow(() ->
                new RegraDeNegocioException("E-mail ou senha inválidos")
            );

        if (!passwordEncoder.matches(request.senha(), usuario.getSenhaHash())) {
            throw new RegraDeNegocioException("E-mail ou senha inválidos");
        }

        return new LoginResponse(
            usuario.getId(),
            usuario.getNome(),
            usuario.getTipoGlobal().name(),
            "Login realizado com sucesso"
        );
    }

    public UsuarioResponse buscarPorId(Long id) {

        Usuario usuario = usuarioRepository
            .findById(id)
            .orElseThrow(() ->
                new RecursoNaoEncontradoException("Usuário não encontrado")
            );

        return new UsuarioResponse(
            usuario.getId(),
            usuario.getNome(),
            usuario.getEmail(),
            usuario.getCargo()
        );
    }

    public Usuario buscarUsuarioCompletoPorId(Long id) {

        return usuarioRepository
            .findById(id)
            .orElseThrow(() ->
                new RecursoNaoEncontradoException("Usuário não encontrado")
            );
    }

    public List<UsuarioResponse> listar() {

        return usuarioRepository
            .findAll()
            .stream()
            .map(u -> new UsuarioResponse(
                u.getId(),
                u.getNome(),
                u.getEmail(),
                u.getCargo()
            ))
            .collect(Collectors.toList());
    }
}