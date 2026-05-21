package com.aquareward.backend.repository;

import com.aquareward.backend.model.Hotel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HotelRepository extends MongoRepository<Hotel, String> {
    Optional<Hotel> findByAdminEmail(String adminEmail);
}
