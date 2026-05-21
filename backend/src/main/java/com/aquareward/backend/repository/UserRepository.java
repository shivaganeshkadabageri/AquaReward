package com.aquareward.backend.repository;

import com.aquareward.backend.model.Role;
import com.aquareward.backend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    List<User> findByHotelIdAndRole(String hotelId, Role role);
    List<User> findByRole(Role role);
}
