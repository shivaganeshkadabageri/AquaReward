package com.aquareward.backend.config;

import com.aquareward.backend.model.*;
import com.aquareward.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {
    private final UserRepository userRepository;
    private final HotelRepository hotelRepository;
    private final RewardRepository rewardRepository;
    private final ChallengeRepository challengeRepository;
    private final WaterUsageRepository waterUsageRepository;
    private final PasswordEncoder encoder;

    @Override
    public void run(String... args) throws Exception {
        if (hotelRepository.count() > 0) {
            log.info("Database is already seeded. Skipping seeder.");
            return;
        }

        log.info("Database is empty. Initiating data seeding...");

        // 1. Create default hotel
        Hotel hotel = Hotel.builder()
                .hotelName("Eco Haven Resort")
                .address("100 Sustainability Boulevard, Green Bay")
                .rooms(Arrays.asList("101", "102", "103", "201", "202", "203"))
                .adminEmail("admin@ecohaven.com")
                .build();
        hotel = hotelRepository.save(hotel);
        String hotelId = hotel.getId();

        // 2. Create Hotel Admin
        User admin = User.builder()
                .name("Sarah Jenkins")
                .email("admin@ecohaven.com")
                .password(encoder.encode("adminpassword"))
                .role(Role.ROLE_HOTEL_ADMIN)
                .hotelId(hotelId)
                .build();
        userRepository.save(admin);

        // 3. Create Default Challenges
        Challenge challenge1 = Challenge.builder()
                .hotelId(hotelId)
                .challengeName("Eco Saver Daily Limit")
                .targetLiters(100.0)
                .rewardPoints(50)
                .description("Maintain your daily water consumption below 100 liters to receive bonus points.")
                .type("DAILY")
                .build();
        
        Challenge challenge2 = Challenge.builder()
                .hotelId(hotelId)
                .challengeName("Eco Master Challenge")
                .targetLiters(80.0)
                .rewardPoints(80)
                .description("Achieve high efficiency by using less than 80 liters of water today!")
                .type("DAILY")
                .build();
                
        challengeRepository.saveAll(Arrays.asList(challenge1, challenge2));

        // 4. Create Default Rewards
        Reward reward1 = Reward.builder()
                .hotelId(hotelId)
                .rewardName("Ocean Spa Massage")
                .pointsRequired(250)
                .description("Dine in peace with a complimentary 30-minute organic oil massage at our eco-spa.")
                .imageUrl("https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=400")
                .build();

        Reward reward2 = Reward.builder()
                .hotelId(hotelId)
                .rewardName("Organic Wine Bottle")
                .pointsRequired(150)
                .description("Enjoy a fine bottle of locally sourced biodynamic organic red wine delivered to your room.")
                .imageUrl("https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=400")
                .build();

        Reward reward3 = Reward.builder()
                .hotelId(hotelId)
                .rewardName("Room Suite Upgrade")
                .pointsRequired(500)
                .description("Get upgraded to our Premium Eco-Suite equipped with high-efficiency showers and smart temperature panels.")
                .imageUrl("https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=400")
                .build();

        rewardRepository.saveAll(Arrays.asList(reward1, reward2, reward3));

        // 5. Create Default Guests
        User emma = User.builder()
                .name("Emma Watson")
                .email("emma@guest.com")
                .password(encoder.encode("guestpassword"))
                .role(Role.ROLE_GUEST)
                .hotelId(hotelId)
                .roomNumber("101")
                .points(320)
                .ecoLevel("Water Warrior")
                .streakDays(4)
                .lastActiveDate(LocalDate.now())
                .badges(Arrays.asList("3-Day Saving Streak", "Ultra Saver"))
                .build();

        User liam = User.builder()
                .name("Liam Neeson")
                .email("liam@guest.com")
                .password(encoder.encode("guestpassword"))
                .role(Role.ROLE_GUEST)
                .hotelId(hotelId)
                .roomNumber("102")
                .points(180)
                .ecoLevel("Eco Explorer")
                .streakDays(2)
                .lastActiveDate(LocalDate.now())
                .badges(Collections.singletonList("Smart Guest"))
                .build();

        User sophia = User.builder()
                .name("Sophia Loren")
                .email("sophia@guest.com")
                .password(encoder.encode("guestpassword"))
                .role(Role.ROLE_GUEST)
                .hotelId(hotelId)
                .roomNumber("201")
                .points(480)
                .ecoLevel("Water Warrior")
                .streakDays(5)
                .lastActiveDate(LocalDate.now())
                .badges(Arrays.asList("3-Day Saving Streak", "Ultra Saver", "Eco Hero"))
                .build();

        emma = userRepository.save(emma);
        liam = userRepository.save(liam);
        sophia = userRepository.save(sophia);

        // 6. Create realistic historical water usage records for the past 7 days
        List<User> guests = Arrays.asList(emma, liam, sophia);
        LocalDate today = LocalDate.now();

        for (User guest : guests) {
            for (int d = 6; d >= 0; d--) {
                LocalDate date = today.minusDays(d);
                // Seed a random but realistic usage log (SHOWER, TAP, LAUNDRY, BATHROOM)
                double multiplier = guest.getName().equals("Sophia Loren") ? 0.7 : 0.95; // Sophia saves the most
                
                WaterUsage shower = WaterUsage.builder()
                        .guestId(guest.getId())
                        .roomNumber(guest.getRoomNumber())
                        .hotelId(hotelId)
                        .date(date)
                        .litersUsed(Math.round((35.0 + Math.random() * 20.0) * multiplier * 10.0) / 10.0)
                        .category(WaterCategory.SHOWER)
                        .build();

                WaterUsage tap = WaterUsage.builder()
                        .guestId(guest.getId())
                        .roomNumber(guest.getRoomNumber())
                        .hotelId(hotelId)
                        .date(date)
                        .litersUsed(Math.round((10.0 + Math.random() * 8.0) * multiplier * 10.0) / 10.0)
                        .category(WaterCategory.TAP)
                        .build();

                WaterUsage bathroom = WaterUsage.builder()
                        .guestId(guest.getId())
                        .roomNumber(guest.getRoomNumber())
                        .hotelId(hotelId)
                        .date(date)
                        .litersUsed(Math.round((25.0 + Math.random() * 10.0) * multiplier * 10.0) / 10.0)
                        .category(WaterCategory.BATHROOM)
                        .build();

                waterUsageRepository.saveAll(Arrays.asList(shower, tap, bathroom));

                // Add laundry every 3 days
                if (d % 3 == 0) {
                    WaterUsage laundry = WaterUsage.builder()
                            .guestId(guest.getId())
                            .roomNumber(guest.getRoomNumber())
                            .hotelId(hotelId)
                            .date(date)
                            .litersUsed(Math.round((30.0 + Math.random() * 15.0) * multiplier * 10.0) / 10.0)
                            .category(WaterCategory.LAUNDRY)
                            .build();
                    waterUsageRepository.save(laundry);
                }
            }
        }

        log.info("Database successfully seeded with default hotel, 3 default users (1 Admin, 3 Guests), challenges, rewards, and 7-day realistic water usages.");
    }
}
