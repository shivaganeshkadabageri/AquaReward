package com.aquareward.backend.service;

import com.aquareward.backend.model.*;
import com.aquareward.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final WaterUsageRepository waterUsageRepository;
    private final UserRepository userRepository;
    private final RewardRepository rewardRepository;
    private final ChallengeRepository challengeRepository;
    private final RedemptionRepository redemptionRepository;

    private static final double AVERAGE_GUEST_DAILY_LITERS = 150.0;

    public Map<String, Object> getHotelAdminAnalytics(String hotelId) {
        List<WaterUsage> usageList = waterUsageRepository.findByHotelId(hotelId);
        List<User> guests = userRepository.findByHotelIdAndRole(hotelId, Role.ROLE_GUEST);

        // 1. Total Hotel Water Consumption (All time or today/this month)
        double totalConsumption = usageList.stream().mapToDouble(WaterUsage::getLitersUsed).sum();

        // 2. Active Guests
        int activeGuestsCount = guests.size();

        // 3. Water saved this month vs expected standard
        long totalActiveGuestDays = usageList.stream()
                .map(u -> u.getGuestId() + "-" + u.getDate().toString())
                .distinct()
                .count();
        double expectedConsumption = totalActiveGuestDays * AVERAGE_GUEST_DAILY_LITERS;
        double waterSaved = Math.max(0.0, expectedConsumption - totalConsumption);

        // 4. Most Eco-Friendly Guests (Sorted by points)
        List<Map<String, Object>> topGuests = guests.stream()
                .sorted((g1, g2) -> Integer.compare(g2.getPoints(), g1.getPoints()))
                .limit(5)
                .map(g -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("name", g.getName());
                    map.put("roomNumber", g.getRoomNumber());
                    map.put("points", g.getPoints());
                    map.put("ecoLevel", g.getEcoLevel());
                    return map;
                })
                .collect(Collectors.toList());

        // 5. Daily analytics trends (Past 7 days)
        LocalDate today = LocalDate.now();
        List<Map<String, Object>> dailyTrends = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            double dailyUsage = usageList.stream()
                    .filter(u -> u.getDate().equals(date))
                    .mapToDouble(WaterUsage::getLitersUsed)
                    .sum();
            
            Map<String, Object> dayMap = new HashMap<>();
            dayMap.put("date", date.toString());
            dayMap.put("litersUsed", dailyUsage);
            dailyTrends.add(dayMap);
        }

        // 6. Category breakdown
        Map<String, Double> categoryBreakdown = new HashMap<>();
        for (WaterUsage usage : usageList) {
            categoryBreakdown.put(usage.getCategory().name(), 
                    categoryBreakdown.getOrDefault(usage.getCategory().name(), 0.0) + usage.getLitersUsed());
        }

        // 7. Room-wise Consumption
        Map<String, Double> roomBreakdown = new HashMap<>();
        for (WaterUsage usage : usageList) {
            roomBreakdown.put(usage.getRoomNumber(), 
                    roomBreakdown.getOrDefault(usage.getRoomNumber(), 0.0) + usage.getLitersUsed());
        }
        
        List<Map<String, Object>> roomAnalytics = new ArrayList<>();
        roomBreakdown.forEach((room, usage) -> {
            Map<String, Object> roomMap = new HashMap<>();
            roomMap.put("roomNumber", room);
            roomMap.put("litersUsed", usage);
            roomAnalytics.add(roomMap);
        });

        // 8. Reward Redemptions Analytics
        List<Redemption> redemptions = redemptionRepository.findAll();
        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalConsumption", totalConsumption);
        analytics.put("activeGuests", activeGuestsCount);
        analytics.put("waterSaved", waterSaved);
        analytics.put("topGuests", topGuests);
        analytics.put("dailyTrends", dailyTrends);
        analytics.put("categoryBreakdown", categoryBreakdown);
        analytics.put("roomAnalytics", roomAnalytics);
        analytics.put("totalRedemptions", redemptions.size());

        return analytics;
    }

    public Reward createReward(String hotelId, Reward reward) {
        reward.setHotelId(hotelId);
        return rewardRepository.save(reward);
    }

    public Challenge createChallenge(String hotelId, Challenge challenge) {
        challenge.setHotelId(hotelId);
        return challengeRepository.save(challenge);
    }

    public void removeGuest(String userId) {
        userRepository.deleteById(userId);
    }

    public List<User> getGuestsByHotel(String hotelId) {
        return userRepository.findByHotelIdAndRole(hotelId, Role.ROLE_GUEST);
    }
}
