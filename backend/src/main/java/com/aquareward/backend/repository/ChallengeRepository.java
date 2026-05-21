package com.aquareward.backend.repository;

import com.aquareward.backend.model.Challenge;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChallengeRepository extends MongoRepository<Challenge, String> {
    List<Challenge> findByHotelId(String hotelId);
}
