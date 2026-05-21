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
@Document(collection = "rewards")
public class Reward {
    @Id
    private String id;
    
    private String hotelId;
    
    private String rewardName;
    
    private int pointsRequired;
    
    private String description;
    
    private String imageUrl;
}
