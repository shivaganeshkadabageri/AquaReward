package com.aquareward.backend.controller;

import com.aquareward.backend.dto.JwtResponse;
import com.aquareward.backend.dto.LoginRequest;
import com.aquareward.backend.dto.SignupRequest;
import com.aquareward.backend.model.User;
import com.aquareward.backend.repository.HotelRepository;
import com.aquareward.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final HotelRepository hotelRepository;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            JwtResponse jwtResponse = authService.authenticateUser(loginRequest);
            return ResponseEntity.ok(jwtResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        try {
            User registeredUser = authService.registerUser(signUpRequest);
            return ResponseEntity.ok("User registered successfully: " + registeredUser.getEmail());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/hotels")
    public ResponseEntity<?> getAllHotels() {
        try {
            return ResponseEntity.ok(hotelRepository.findAll());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
