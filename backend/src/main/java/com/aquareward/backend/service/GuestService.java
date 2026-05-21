package com.aquareward.backend.service;

import com.aquareward.backend.model.Role;
import com.aquareward.backend.model.User;
import com.aquareward.backend.model.WaterUsage;
import com.aquareward.backend.repository.UserRepository;
import com.aquareward.backend.repository.WaterUsageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GuestService {
    private final UserRepository userRepository;
    private final WaterUsageRepository waterUsageRepository;

    private static final double AVERAGE_GUEST_DAILY_LITERS = 150.0;

    public Map<String, Object> getGuestDashboardStats(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<WaterUsage> usageList = waterUsageRepository.findByGuestId(userId);
        LocalDate today = LocalDate.now();

        // 1. Daily usage today
        double dailyUsage = usageList.stream()
                .filter(u -> u.getDate().equals(today))
                .mapToDouble(WaterUsage::getLitersUsed)
                .sum();

        // 2. Weekly usage (past 7 days including today)
        LocalDate sevenDaysAgo = today.minusDays(6);
        double weeklyUsage = usageList.stream()
                .filter(u -> !u.getDate().isBefore(sevenDaysAgo) && !u.getDate().isAfter(today))
                .mapToDouble(WaterUsage::getLitersUsed)
                .sum();

        // 3. Monthly usage (past 30 days including today)
        LocalDate thirtyDaysAgo = today.minusDays(29);
        double monthlyUsage = usageList.stream()
                .filter(u -> !u.getDate().isBefore(thirtyDaysAgo) && !u.getDate().isAfter(today))
                .mapToDouble(WaterUsage::getLitersUsed)
                .sum();

        // 4. Rank among hotel guests
        List<User> hotelGuests = userRepository.findByHotelIdAndRole(user.getHotelId(), Role.ROLE_GUEST);
        hotelGuests.sort((u1, u2) -> Integer.compare(u2.getPoints(), u1.getPoints())); // Descending order of points
        
        int rank = 1;
        for (int i = 0; i < hotelGuests.size(); i++) {
            if (hotelGuests.get(i).getId().equals(user.getId())) {
                rank = i + 1;
                break;
            }
        }

        // 5. Water saved vs average guest (based on how many days they have usage logged)
        long activeDays = usageList.stream()
                .map(WaterUsage::getDate)
                .distinct()
                .count();
        if (activeDays == 0) activeDays = 1;

        double totalLitersUsed = usageList.stream().mapToDouble(WaterUsage::getLitersUsed).sum();
        double totalExpectedLiters = activeDays * AVERAGE_GUEST_DAILY_LITERS;
        double litersSaved = Math.max(0.0, totalExpectedLiters - totalLitersUsed);
        double percentageSaved = totalExpectedLiters > 0 ? (litersSaved / totalExpectedLiters) * 100 : 0.0;

        // 6. Category breakdown
        Map<String, Double> categoryBreakdown = new HashMap<>();
        for (WaterUsage usage : usageList) {
            categoryBreakdown.put(usage.getCategory().name(), 
                    categoryBreakdown.getOrDefault(usage.getCategory().name(), 0.0) + usage.getLitersUsed());
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("guestName", user.getName());
        stats.put("roomNumber", user.getRoomNumber());
        stats.put("points", user.getPoints());
        stats.put("ecoLevel", user.getEcoLevel());
        stats.put("streakDays", user.getStreakDays());
        stats.put("badges", user.getBadges() != null ? user.getBadges() : Collections.emptyList());
        stats.put("dailyUsage", dailyUsage);
        stats.put("weeklyUsage", weeklyUsage);
        stats.put("monthlyUsage", monthlyUsage);
        stats.put("rank", rank);
        stats.put("totalGuests", hotelGuests.size());
        stats.put("litersSaved", litersSaved);
        stats.put("percentageSaved", percentageSaved);
        stats.put("categoryBreakdown", categoryBreakdown);

        return stats;
    }

    public List<Map<String, Object>> getHotelLeaderboard(String hotelId) {
        List<User> guests = userRepository.findByHotelIdAndRole(hotelId, Role.ROLE_GUEST);
        guests.sort((u1, u2) -> Integer.compare(u2.getPoints(), u1.getPoints()));

        List<Map<String, Object>> leaderboard = new ArrayList<>();
        for (int i = 0; i < guests.size(); i++) {
            User guest = guests.get(i);
            Map<String, Object> entry = new HashMap<>();
            entry.put("rank", i + 1);
            entry.put("name", guest.getName());
            entry.put("points", guest.getPoints());
            entry.put("ecoLevel", guest.getEcoLevel());
            entry.put("streakDays", guest.getStreakDays());
            entry.put("badgesCount", guest.getBadges() != null ? guest.getBadges().size() : 0);
            leaderboard.add(entry);
        }

        return leaderboard;
    }
}
