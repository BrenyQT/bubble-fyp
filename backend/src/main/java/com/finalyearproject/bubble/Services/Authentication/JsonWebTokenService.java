package com.finalyearproject.bubble.Services.Authentication;

import com.finalyearproject.bubble.Exceptions.Authentication.JsonWebTokenServiceExceptions;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;


// TO:DO Set up
// JWT FILTER = LOGIC FOR CHECKING A JWT IN A REQUEST
// SECURITY CONFIG = SELECTS WHICH ENDPOINTS ARE AUTHENTICATED


@Service
public class JsonWebTokenService {

    private final SecretKey JsonWebTokenSecretKey;
    private final long tokenExpirationMillis; // Expiration time for JWT

    // Constructor to inject JWT secret and expiration time from .env
    @Autowired
    public JsonWebTokenService(
            @Value("${JWT_SECRET}") String jwtSecret,
            @Value("${JWT_EXPIRATION_MS}") long tokenExpirationMillis) {
        this.JsonWebTokenSecretKey = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        this.tokenExpirationMillis = tokenExpirationMillis;
    }

    //  Generate a JWT Token for a given user ID
    public String generateToken(String userId) {
        return Jwts.builder()
                .setSubject(userId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + tokenExpirationMillis))
                .signWith(JsonWebTokenSecretKey, SignatureAlgorithm.HS256) //  Use proper signing method
                .compact();
    }

    //  Validate and Parse a JWT Token
    public Claims validateToken(String token) {
        try {
            return Jwts.parserBuilder() //  Use parserBuilder() (fix deprecation)
                    .setSigningKey(JsonWebTokenSecretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException e) {
            throw new JsonWebTokenServiceExceptions.TokenExpiredException("Token has expired", e);
        } catch (MalformedJwtException e) {
            throw new JsonWebTokenServiceExceptions.InvalidTokenException("Token is malformed", e);
        } catch (SignatureException e) {
            throw new JsonWebTokenServiceExceptions.InvalidTokenException("Invalid token signature", e);
        } catch (Exception e) {
            throw new JsonWebTokenServiceExceptions.InvalidTokenException("Token validation failed", e);
        }
    }

    //  Extract User ID from Token
    public String extractSubjectsUserId(String token) {
        return validateToken(token).getSubject(); //  Reuse validateToken() method
    }
}
