package com.aquareward.backend.controller;

import com.aquareward.backend.config.UserDetailsImpl;
import com.aquareward.backend.dto.RedeemRequest;
import com.aquareward.backend.model.Redemption;
import com.aquareward.backend.model.Reward;
import com.aquareward.backend.service.RewardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rewards")
@RequiredArgsConstructor
public class RewardController {
    private final RewardService rewardService;

    @GetMapping
    public ResponseEntity<?> getAvailableRewards(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            List<Reward> rewards = rewardService.getRewardsByHotel(userDetails.getHotelId());
            return ResponseEntity.ok(rewards);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/redeem")
    public ResponseEntity<?> redeemReward(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody RedeemRequest redeemRequest) {
        try {
            Redemption redemption = rewardService.redeemReward(userDetails.getId(), redeemRequest.getRewardId());
            return ResponseEntity.ok(redemption);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/my-redemptions")
    public ResponseEntity<?> getMyRedemptions(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            List<Redemption> redemptions = rewardService.getGuestRedemptions(userDetails.getId());
            return ResponseEntity.ok(redemptions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
