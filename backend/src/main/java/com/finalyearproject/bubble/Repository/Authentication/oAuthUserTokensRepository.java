package com.finalyearproject.bubble.Repository.Authentication;

import com.finalyearproject.bubble.Entity.Authentication.oAuthUserTokens;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface oAuthUserTokensRepository extends JpaRepository<oAuthUserTokens, String> {
    Optional<oAuthUserTokens> findById(String id);
}
