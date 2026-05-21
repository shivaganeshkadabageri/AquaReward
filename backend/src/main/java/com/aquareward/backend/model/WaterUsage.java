package com.aquareward.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "water_usages")
public class WaterUsage {
    @Id
    private String id;
    
    private String guestId;
    
    private String roomNumber;
    
    private String hotelId;
    
    private LocalDate date;
    
    private double litersUsed;
    
    private WaterCategory category;
}
