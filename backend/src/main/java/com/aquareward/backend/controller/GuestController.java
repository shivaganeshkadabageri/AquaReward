package com.aquareward.backend.controller;

import com.aquareward.backend.config.UserDetailsImpl;
import com.aquareward.backend.dto.UsageSimRequest;
import com.aquareward.backend.model.WaterUsage;
import com.aquareward.backend.repository.ChallengeRepository;
import com.aquareward.backend.service.GuestService;
import com.aquareward.backend.service.WaterUsageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/guests")
@RequiredArgsConstructor
public class GuestController {
    private final GuestService guestService;
    private final WaterUsageService waterUsageService;
    private final ChallengeRepository challengeRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardStats(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            Map<String, Object> stats = guestService.getGuestDashboardStats(userDetails.getId());
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/challenges")
    public ResponseEntity<?> getChallenges(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            return ResponseEntity.ok(challengeRepository.findByHotelId(userDetails.getHotelId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<?> getLeaderboard(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            List<Map<String, Object>> leaderboard = guestService.getHotelLeaderboard(userDetails.getHotelId());
            return ResponseEntity.ok(leaderboard);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/water-usage/simulate")
    public ResponseEntity<?> simulateUsage(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody UsageSimRequest usageRequest) {
        try {
            WaterUsage usage = waterUsageService.simulateUsage(userDetails.getId(), usageRequest);
            return ResponseEntity.ok(usage);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/water-usage/history")
    public ResponseEntity<?> getUsageHistory(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            List<WaterUsage> history = waterUsageService.getGuestUsageHistory(userDetails.getId());
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/ai-tips")
    public ResponseEntity<?> getAiTips(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            Map<String, Object> tips = waterUsageService.getAiWaterSavingTips(userDetails.getId());
            return ResponseEntity.ok(tips);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
