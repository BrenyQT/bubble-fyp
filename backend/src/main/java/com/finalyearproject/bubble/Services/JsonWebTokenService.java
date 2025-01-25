package com.finalyearproject.bubble.Services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;

import javax.crypto.SecretKey;
import java.util.Date;

public class JsonWebTokenService {
    private final SecretKey JsonWebTokenSecretKey;

    public JsonWebTokenService(@Value("${JWT_SECRET}") String googleClientSecret) {
        this.JsonWebTokenSecretKey = Keys.hmacShaKeyFor(googleClientSecret.getBytes());
    }

    // Allows for the creation of a JWT
    public String generateToken(String email) {
        long oneHourInMillis = 60 * 60 * 1000;

        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + oneHourInMillis))
                .signWith(SignatureAlgorithm.HS256, JsonWebTokenSecretKey)
                .compact();
    }

    // Checks if a  JWT is valid/expired
    public Claims validateToken(String token) {
//        try {
            return Jwts.parser()
                    .setSigningKey(JsonWebTokenSecretKey)
                    .parseClaimsJws(token)
                    .getBody();
//        } catch (ExpiredJwtException e) {
//            throw new JwtServiceExceptions.TokenExpiredException("Token has expired", e);
//        } catch (JwtException | IllegalArgumentException e) {
//            throw new JwtServiceExceptions.InvalidTokenException("Token is invalid", e);
//        }
    }

    // Extracts the Subject/User from the JWT
    public String extractSubject(String jwt) {
//        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(JsonWebTokenSecretKey) // Set the secret key to verify the signature
                    .parseClaimsJws(jwt)
                    .getBody();

            return claims.getSubject();
//        } catch (SignatureException e) {
//            throw new RuntimeException("Invalid JWT signature", e);
//        } catch (Exception e) {
//            throw new RuntimeException("Error while parsing the JWT", e);
//        }
    }
}