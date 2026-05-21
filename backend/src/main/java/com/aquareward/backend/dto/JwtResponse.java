package com.aquareward.backend.dto;

import com.aquareward.backend.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private String id;
    private String name;
    private String email;
    private Role role;
    private String hotelId;
    private String roomNumber;
}
