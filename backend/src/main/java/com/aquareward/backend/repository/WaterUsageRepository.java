package com.aquareward.backend.repository;

import com.aquareward.backend.model.WaterUsage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface WaterUsageRepository extends MongoRepository<WaterUsage, String> {
    List<WaterUsage> findByGuestId(String guestId);
    List<WaterUsage> findByGuestIdAndDate(String guestId, LocalDate date);
    List<WaterUsage> findByHotelIdAndDate(String hotelId, LocalDate date);
    List<WaterUsage> findByHotelId(String hotelId);
}
