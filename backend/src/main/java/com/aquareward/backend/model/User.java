package com.aquareward.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {
    @Id
    private String id;
    
    private String name;
    
    @Indexed(unique = true)
    private String email;
    
    private String password;
    
    private Role role;
    
    private String hotelId;
    
    private String roomNumber;
    
    @Builder.Default
    private int points = 0;
    
    @Builder.Default
    private String ecoLevel = "Beginner Saver"; // e.g. Beginner Saver, Eco Explorer, Water Warrior, Sustainability Champion
    
    @Builder.Default
    private int streakDays = 0;
    
    private LocalDate lastActiveDate;
    
    @Builder.Default
    private List<String> badges = new ArrayList<>();
}
