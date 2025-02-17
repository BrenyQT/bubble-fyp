package com.finalyearproject.bubble.Repository.Authentication;

import com.finalyearproject.bubble.Entity.Authentication.oAuthUserDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface oAuthUserDetailsRepository extends JpaRepository<oAuthUserDetails, String> {

    Optional<oAuthUserDetails> findById(String id);

    Optional<oAuthUserDetails> findByEmail(String email);
}
