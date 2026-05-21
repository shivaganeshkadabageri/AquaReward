package com.aquareward.backend.dto;

import lombok.Data;

@Data
public class UsageSimRequest {
    private String category; // SHOWER, TAP, LAUNDRY, BATHROOM
    private double litersUsed;
}
