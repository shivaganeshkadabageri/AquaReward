package com.aquareward.backend.service;

import com.aquareward.backend.dto.UsageSimRequest;
import com.aquareward.backend.model.*;
import com.aquareward.backend.repository.ChallengeRepository;
import com.aquareward.backend.repository.UserRepository;
import com.aquareward.backend.repository.WaterUsageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class WaterUsageService {
    private final WaterUsageRepository waterUsageRepository;
    private final UserRepository userRepository;
    private final ChallengeRepository challengeRepository;

    private static final double DAILY_BUDGET_LIMIT = 120.0;

    public WaterUsage simulateUsage(String userId, UsageSimRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        WaterCategory category;
        try {
            category = WaterCategory.valueOf(request.getCategory().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid water usage category");
        }

        WaterUsage waterUsage = WaterUsage.builder()
                .guestId(userId)
                .roomNumber(user.getRoomNumber())
                .hotelId(user.getHotelId())
                .date(LocalDate.now())
                .litersUsed(request.getLitersUsed())
                .category(category)
                .build();

        waterUsage = waterUsageRepository.save(waterUsage);

        // Re-calculate gamification values for the user
        updateUserGamification(user);

        return waterUsage;
    }

    public List<WaterUsage> getGuestUsageHistory(String userId) {
        return waterUsageRepository.findByGuestId(userId);
    }

    private void updateUserGamification(User user) {
        LocalDate today = LocalDate.now();
        List<WaterUsage> todayUsages = waterUsageRepository.findByGuestIdAndDate(user.getId(), today);
        
        double totalLitersUsedToday = todayUsages.stream()
                .mapToDouble(WaterUsage::getLitersUsed)
                .sum();

        int pointsEarned = 10; // 10 points for logging water saving behavior

        // If today's water usage is below threshold, increment streak and award bonus
        if (totalLitersUsedToday <= DAILY_BUDGET_LIMIT) {
            pointsEarned += 15; // Bonus for staying within daily budget limit
            
            // Streak handling
            if (user.getLastActiveDate() != null) {
                if (user.getLastActiveDate().equals(today.minusDays(1))) {
                    user.setStreakDays(user.getStreakDays() + 1);
                } else if (!user.getLastActiveDate().equals(today)) {
                    user.setStreakDays(1);
                }
            } else {
                user.setStreakDays(1);
            }
        } else {
            // Broke the streak if exceeded budget limit
            user.setStreakDays(0);
        }

        user.setLastActiveDate(today);
        user.setPoints(user.getPoints() + pointsEarned);

        // Evaluate challenges
        List<Challenge> challenges = challengeRepository.findByHotelId(user.getHotelId());
        for (Challenge challenge : challenges) {
            if ("DAILY".equals(challenge.getType()) && totalLitersUsedToday <= challenge.getTargetLiters()) {
                // If staying under the challenge threshold, award bonus points
                user.setPoints(user.getPoints() + challenge.getRewardPoints());
            }
        }

        // Evaluate Levels
        String previousLevel = user.getEcoLevel();
        if (user.getPoints() < 100) {
            user.setEcoLevel("Beginner Saver");
        } else if (user.getPoints() < 300) {
            user.setEcoLevel("Eco Explorer");
        } else if (user.getPoints() < 600) {
            user.setEcoLevel("Water Warrior");
        } else {
            user.setEcoLevel("Sustainability Champion");
        }

        // Evaluate Badges
        List<String> currentBadges = user.getBadges();
        if (currentBadges == null) {
            currentBadges = new ArrayList<>();
        }

        if (user.getStreakDays() >= 3 && !currentBadges.contains("3-Day Saving Streak")) {
            currentBadges.add("3-Day Saving Streak");
        }
        if (user.getStreakDays() >= 5 && !currentBadges.contains("Eco Hero")) {
            currentBadges.add("Eco Hero");
        }
        if (user.getPoints() >= 200 && !currentBadges.contains("Ultra Saver")) {
            currentBadges.add("Ultra Saver");
        }
        if (totalLitersUsedToday < 70 && !currentBadges.contains("Smart Guest") && todayUsages.size() >= 2) {
            currentBadges.add("Smart Guest");
        }
        user.setBadges(currentBadges);

        userRepository.save(user);
    }

    public Map<String, Object> getAiWaterSavingTips(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<WaterUsage> usageHistory = waterUsageRepository.findByGuestId(userId);

        Map<WaterCategory, Double> categoryTotals = new HashMap<>();
        for (WaterUsage usage : usageHistory) {
            categoryTotals.put(usage.getCategory(), categoryTotals.getOrDefault(usage.getCategory(), 0.0) + usage.getLitersUsed());
        }

        List<String> recommendations = new ArrayList<>();
        String primaryAnomaly = "None";

        double showerTotal = categoryTotals.getOrDefault(WaterCategory.SHOWER, 0.0);
        double tapTotal = categoryTotals.getOrDefault(WaterCategory.TAP, 0.0);
        double laundryTotal = categoryTotals.getOrDefault(WaterCategory.LAUNDRY, 0.0);
        double bathroomTotal = categoryTotals.getOrDefault(WaterCategory.BATHROOM, 0.0);

        if (showerTotal > tapTotal && showerTotal > laundryTotal && showerTotal > bathroomTotal) {
            recommendations.add("Your shower duration seems to account for your largest water usage. Try reducing your shower time by 2 minutes to save up to 18 liters!");
            recommendations.add("Turn off the shower flow while soaping or washing your hair.");
            primaryAnomaly = "Shower Duration";
        } else if (tapTotal > showerTotal && tapTotal > laundryTotal && tapTotal > bathroomTotal) {
            recommendations.add("Your tap usage is high. Ensure that the faucet is shut tightly and you are not leaving it running while brushing your teeth.");
            recommendations.add("Use a cup of water instead of a running stream when brushing or shaving.");
            primaryAnomaly = "Tap Water Faucet";
        } else if (laundryTotal > showerTotal && laundryTotal > tapTotal && laundryTotal > bathroomTotal) {
            recommendations.add("Laundry is consuming significant water. Opt for full washing machine loads or skip a laundry cycle if staying for only a few days.");
            primaryAnomaly = "Laundry Cycles";
        } else {
            recommendations.add("General Tip: Challenge yourself to wash hands quickly and keep tap runs below 10 seconds!");
            recommendations.add("Utilize the dual-flush system in your bathroom. Use the half-flush when appropriate to save up to 4 liters per flush.");
            primaryAnomaly = "General Flush / Faucet";
        }

        Map<String, Object> result = new HashMap<>();
        result.put("recommendations", recommendations);
        result.put("primaryAnomaly", primaryAnomaly);
        result.put("litersAnalyzed", showerTotal + tapTotal + laundryTotal + bathroomTotal);
        return result;
    }
}
