package com.website.authservice.web.controller;

import com.website.authservice.application.service.AuthService;
import com.website.authservice.web.request.LoginRequest;
import com.website.authservice.web.request.RefreshRequest;
import com.website.authservice.web.response.AuthResponse;
import com.website.authservice.web.response.CurrentUserResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Auth", description = "KRAN Website CMS admin authentication")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate CMS admin and receive JWT access + refresh tokens")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest loginRequest,
            HttpServletRequest httpServletRequest
    ) {
        return ResponseEntity.ok(authService.login(
                loginRequest.username(),
                loginRequest.password(),
                httpServletRequest
        ));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Rotate refresh token and issue a new access token")
    public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody RefreshRequest refreshRequest) {
        return ResponseEntity.ok(authService.refresh(refreshRequest.refreshToken()));
    }

    @PostMapping("/logout")
    @Operation(summary = "Revoke the current access token")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Void> logout(HttpServletRequest httpServletRequest) {
        authService.logout(httpServletRequest);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    @Operation(summary = "Return the authenticated admin user")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<CurrentUserResponse> me(HttpServletRequest httpServletRequest) {
        return ResponseEntity.ok(authService.currentUser(httpServletRequest));
    }
}
