package com.camilly.forense.api.config;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

import com.camilly.forense.api.service.LogAcessoService;

@Component
@RequiredArgsConstructor
public class LogAcessoInterceptor implements HandlerInterceptor {
    private final LogAcessoService logAcessoService;

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        String idUsuarioStr = request.getParameter("idUsuarioLogado");
        Long idUsuario = null;
        if (idUsuarioStr != null && !idUsuarioStr.isEmpty()) {
            try { idUsuario = Long.parseLong(idUsuarioStr); } catch (NumberFormatException e) {}
        }

        String idSessao = request.getSession().getId();
        String ipOrigem = request.getRemoteAddr();
        String endpoint = request.getMethod() + " " + request.getRequestURI();
        boolean sucesso = response.getStatus() >= 200 && response.getStatus() < 300;

        logAcessoService.registrarAcesso(idUsuario, idSessao, ipOrigem, endpoint, sucesso);
    }
}
