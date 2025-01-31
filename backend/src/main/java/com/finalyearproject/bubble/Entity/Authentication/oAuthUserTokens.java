package com.finalyearproject.bubble.Entity.Authentication;

import jakarta.persistence.*;

@Entity // Ensures this is recognized as a JPA entity
@Table(name = "oauth_user_tokens") // Ensure this matches your database table name
public class oAuthUserTokens {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Adjust based on DB setup
    private Long id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "access_token", nullable = false)
    private String accessToken;

    @Column(name = "refresh_token")
    private String refreshToken;

    @Column(name = "expires_at")
    private Long expiresAt;

    // Constructors
    public oAuthUserTokens() {}

    public oAuthUserTokens(String userId, String accessToken, String refreshToken, Long expiresAt) {
        this.userId = userId;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.expiresAt = expiresAt;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public Long getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Long expiresAt) {
        this.expiresAt = expiresAt;
    }
}
