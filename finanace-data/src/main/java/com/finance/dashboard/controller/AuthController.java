package com.finance.dashboard.controller;

import com.finance.dashboard.dto.ApiResponseDTO;
import com.finance.dashboard.dto.LoginRequestDTO;
import com.finance.dashboard.dto.LoginResponseDTO;
import com.finance.dashboard.entity.User;
import com.finance.dashboard.exception.UnauthorizedException;
import com.finance.dashboard.repository.UserRepository;
import com.finance.dashboard.security.JwtProvider;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtProvider jwtProvider;
    private final UserRepository userRepository;

    public AuthController(AuthenticationManager authenticationManager, JwtProvider jwtProvider, UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtProvider = jwtProvider;
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponseDTO<LoginResponseDTO>> login(@Valid @RequestBody LoginRequestDTO loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            String token = jwtProvider.generateToken(authentication.getName());

            String role = authentication.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .filter(auth -> auth.startsWith("ROLE_"))
                    .map(auth -> auth.replace("ROLE_", ""))
                    .findFirst()
                    .orElse("VIEWER");

            // Fetch the user to get the userId
            User user = userRepository.findByUsername(loginRequest.getUsername())
                    .orElseThrow(() -> new UnauthorizedException("User not found"));

            LoginResponseDTO response = LoginResponseDTO.builder()
                    .token(token)
                    .username(loginRequest.getUsername())
                    .role(role)
                    .userId(user.getId())
                    .build();

            return ResponseEntity.ok(ApiResponseDTO.success(response, "Login successful"));
        } catch (AuthenticationException e) {
            throw new UnauthorizedException("Invalid username or password");
        }
    }
}
