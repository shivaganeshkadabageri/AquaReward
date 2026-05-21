package com.aquareward.backend.repository;

import com.aquareward.backend.model.Reward;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RewardRepository extends MongoRepository<Reward, String> {
    List<Reward> findByHotelId(String hotelId);
}
