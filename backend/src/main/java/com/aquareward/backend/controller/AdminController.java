package com.aquareward.backend.controller;

import com.aquareward.backend.config.UserDetailsImpl;
import com.aquareward.backend.model.Challenge;
import com.aquareward.backend.model.Reward;
import com.aquareward.backend.model.User;
import com.aquareward.backend.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('HOTEL_ADMIN')")
@RequiredArgsConstructor
public class AdminController {
    private final AdminService adminService;

    @GetMapping("/analytics")
    public ResponseEntity<?> getAnalytics(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            Map<String, Object> analytics = adminService.getHotelAdminAnalytics(userDetails.getHotelId());
            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/rewards")
    public ResponseEntity<?> createReward(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody Reward reward) {
        try {
            Reward newReward = adminService.createReward(userDetails.getHotelId(), reward);
            return ResponseEntity.ok(newReward);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/challenges")
    public ResponseEntity<?> createChallenge(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody Challenge challenge) {
        try {
            Challenge newChallenge = adminService.createChallenge(userDetails.getHotelId(), challenge);
            return ResponseEntity.ok(newChallenge);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/guests")
    public ResponseEntity<?> listGuests(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            List<User> guests = adminService.getGuestsByHotel(userDetails.getHotelId());
            return ResponseEntity.ok(guests);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/guests/{guestId}")
    public ResponseEntity<?> deleteGuest(@PathVariable String guestId) {
        try {
            adminService.removeGuest(guestId);
            return ResponseEntity.ok("Guest successfully removed");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
