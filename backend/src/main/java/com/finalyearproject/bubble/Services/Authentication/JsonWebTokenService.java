package com.finalyearproject.bubble.Services.Authentication;

import com.finalyearproject.bubble.Entity.Authentication.oAuthUserDetails;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JsonWebTokenService {

    private final SecretKey secretKey;
    private final long expirationTime;

    public JsonWebTokenService(
            @Value("${JWT_SECRET}") String jwtSecret,
            @Value("${JWT_EXPIRATION_MS}") long expirationTime) {
        this.secretKey = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        this.expirationTime = expirationTime;
    }

    public String generateToken(String userEmail) {
        return Jwts.builder()
                .setSubject(userEmail)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims validateToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
    public String extractEmail(String jwtToken) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(jwtToken)
                .getBody();

        return claims.getSubject();
    }
}
