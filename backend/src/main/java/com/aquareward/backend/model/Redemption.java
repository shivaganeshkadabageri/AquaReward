package com.aquareward.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "redemptions")
public class Redemption {
    @Id
    private String id;
    
    private String guestId;
    
    private String rewardId;
    
    private LocalDateTime redemptionDate;
    
    private String couponCode;
    
    private String status; // ACTIVE, USED
}
