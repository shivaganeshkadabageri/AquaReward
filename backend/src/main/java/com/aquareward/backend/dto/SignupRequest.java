package com.aquareward.backend.dto;

import com.aquareward.backend.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SignupRequest {
    @NotBlank
    private String name;
    
    @NotBlank
    @Email
    private String email;
    
    @NotBlank
    private String password;
    
    @NotNull
    private Role role;
    
    private String hotelId;
    
    private String roomNumber;
    
    private String hotelName; // optional, when admin registers a new hotel
    private String hotelAddress; // optional
}
