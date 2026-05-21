package com.aquareward.backend.repository;

import com.aquareward.backend.model.Redemption;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RedemptionRepository extends MongoRepository<Redemption, String> {
    List<Redemption> findByGuestId(String guestId);
}
