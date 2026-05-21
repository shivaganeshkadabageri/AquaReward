package com.aquareward.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "challenges")
public class Challenge {
    @Id
    private String id;
    
    private String hotelId;
    
    private String challengeName;
    
    private double targetLiters;
    
    private int rewardPoints;
    
    private String description;
    
    private String type; // e.g. DAILY, WEEKLY, STREAK
}
