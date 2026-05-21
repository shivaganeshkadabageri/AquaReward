package com.aquareward.backend.service;

import com.aquareward.backend.config.JwtUtils;
import com.aquareward.backend.config.UserDetailsImpl;
import com.aquareward.backend.dto.JwtResponse;
import com.aquareward.backend.dto.LoginRequest;
import com.aquareward.backend.dto.SignupRequest;
import com.aquareward.backend.model.Hotel;
import com.aquareward.backend.model.Role;
import com.aquareward.backend.model.User;
import com.aquareward.backend.repository.HotelRepository;
import com.aquareward.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final HotelRepository hotelRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;

    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        return JwtResponse.builder()
                .token(jwt)
                .id(userDetails.getId())
                .name(userDetails.getName())
                .email(userDetails.getEmail())
                .role(Role.valueOf(userDetails.getAuthorities().iterator().next().getAuthority()))
                .hotelId(userDetails.getHotelId())
                .roomNumber(userDetails.getRoomNumber())
                .build();
    }

    public User registerUser(SignupRequest signUpRequest) {
        if (userRepository.findByEmail(signUpRequest.getEmail()).isPresent()) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        // Create new user's account
        User user = User.builder()
                .name(signUpRequest.getName())
                .email(signUpRequest.getEmail())
                .password(encoder.encode(signUpRequest.getPassword()))
                .role(signUpRequest.getRole())
                .roomNumber(signUpRequest.getRoomNumber())
                .points(0)
                .ecoLevel("Beginner Saver")
                .badges(new ArrayList<>())
                .streakDays(0)
                .lastActiveDate(LocalDate.now())
                .build();

        if (signUpRequest.getRole() == Role.ROLE_HOTEL_ADMIN) {
            // Admin registration can onboard a new hotel
            Hotel hotel = Hotel.builder()
                    .hotelName(signUpRequest.getHotelName() != null ? signUpRequest.getHotelName() : "Green Resort")
                    .address(signUpRequest.getHotelAddress() != null ? signUpRequest.getHotelAddress() : "Eco Avenue")
                    .adminEmail(signUpRequest.getEmail())
                    .rooms(new ArrayList<>(Collections.singletonList("101")))
                    .build();
            hotel = hotelRepository.save(hotel);
            user.setHotelId(hotel.getId());
        } else {
            // Guest or Super Admin
            user.setHotelId(signUpRequest.getHotelId());
        }

        return userRepository.save(user);
    }
}
