package com.camilly.forense.api.controller.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;

import com.camilly.forense.api.dto.ErrorResponseDTO;

@RestControllerAdvice
public class GlobalExceptionHandler {
    // 400 - Regra de negócio
    @ExceptionHandler(RegraDeNegocioException.class)
    public ResponseEntity<ErrorResponseDTO> handleRegraDeNegocio(RegraDeNegocioException ex, HttpServletRequest request) {
        ErrorResponseDTO error = new ErrorResponseDTO(LocalDateTime.now(), HttpStatus.BAD_REQUEST.value(), "Bad Request", ex.getMessage(), request.getRequestURI());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    // 404 - Recurso não encontrado
    @ExceptionHandler(RecursoNaoEncontradoException.class)
    public ResponseEntity<ErrorResponseDTO> handleNotFound(RecursoNaoEncontradoException ex, HttpServletRequest request) {
        ErrorResponseDTO error = new ErrorResponseDTO(LocalDateTime.now(), HttpStatus.NOT_FOUND.value(), "Not Found", ex.getMessage(), request.getRequestURI());

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    // 400 - Erro de validação (@Valid)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponseDTO> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest request) {
        String mensagem = ex.getBindingResult().getFieldErrors().stream().map(e -> e.getField() + ": " + e.getDefaultMessage()).findFirst().orElse("Erro de validação");
        ErrorResponseDTO error = new ErrorResponseDTO(LocalDateTime.now(), HttpStatus.BAD_REQUEST.value(), "Validation Error", mensagem, request.getRequestURI());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    // 500 - erro genérico (fallback)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDTO> handleGeneric(Exception ex, HttpServletRequest request) {
        ErrorResponseDTO error = new ErrorResponseDTO(LocalDateTime.now(), HttpStatus.INTERNAL_SERVER_ERROR.value(), "Internal Server Error", "Ocorreu um erro inesperado", request.getRequestURI());

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
    
}
