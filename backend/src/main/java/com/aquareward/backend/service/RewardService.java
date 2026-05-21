package com.aquareward.backend.service;

import com.aquareward.backend.model.Redemption;
import com.aquareward.backend.model.Reward;
import com.aquareward.backend.model.User;
import com.aquareward.backend.repository.RedemptionRepository;
import com.aquareward.backend.repository.RewardRepository;
import com.aquareward.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RewardService {
    private final RewardRepository rewardRepository;
    private final RedemptionRepository redemptionRepository;
    private final UserRepository userRepository;

    public List<Reward> getRewardsByHotel(String hotelId) {
        return rewardRepository.findByHotelId(hotelId);
    }

    public Redemption redeemReward(String userId, String rewardId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Reward reward = rewardRepository.findById(rewardId)
                .orElseThrow(() -> new RuntimeException("Reward not found"));

        if (user.getPoints() < reward.getPointsRequired()) {
            throw new RuntimeException("Insufficient eco-points for this reward redemption.");
        }

        // Deduct points
        user.setPoints(user.getPoints() - reward.getPointsRequired());
        userRepository.save(user);

        // Generate coupon code
        String couponCode = "AQ-" + reward.getRewardName().substring(0, Math.min(reward.getRewardName().length(), 3)).toUpperCase() 
                + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();

        Redemption redemption = Redemption.builder()
                .guestId(userId)
                .rewardId(rewardId)
                .redemptionDate(LocalDateTime.now())
                .couponCode(couponCode)
                .status("ACTIVE")
                .build();

        return redemptionRepository.save(redemption);
    }

    public List<Redemption> getGuestRedemptions(String userId) {
        return redemptionRepository.findByGuestId(userId);
    }
}
