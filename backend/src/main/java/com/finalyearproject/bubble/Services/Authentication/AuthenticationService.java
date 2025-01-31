package com.finalyearproject.bubble.Services.Authentication;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.finalyearproject.bubble.Entity.Authentication.oAuthUserDetails;
import com.finalyearproject.bubble.Entity.Authentication.oAuthUserTokens;

import com.finalyearproject.bubble.Repository.Authentication.oAuthUserDetailsRepository;
import com.finalyearproject.bubble.Repository.Authentication.oAuthUserTokensRepository;
import com.finalyearproject.bubble.Services.Authentication.GoogleAuthenticationService;

import com.finalyearproject.bubble.Objects.Authentication.oAuthResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Optional;

@Service
public class AuthenticationService {

    private final JsonWebTokenService jsonWebTokenService;
    private final GoogleAuthenticationService googleAuthenticationService;
    private final oAuthUserDetailsRepository oAuthUserDetailsRepository;
    private final oAuthUserTokensRepository oAuthUserTokensRepository;

    @Autowired
    public AuthenticationService(JsonWebTokenService jsonWebTokenService,
                                 GoogleAuthenticationService googleAuthenticationService,
                                 oAuthUserDetailsRepository oAuthUserDetailsRepository,
                                 oAuthUserTokensRepository oAuthUserTokensRepository) {
        this.jsonWebTokenService = jsonWebTokenService;
        this.googleAuthenticationService = googleAuthenticationService;
        this.oAuthUserDetailsRepository = oAuthUserDetailsRepository;
        this.oAuthUserTokensRepository = oAuthUserTokensRepository;
    }

    public ResponseEntity<oAuthResponse> handleOAuth(
            HttpServletRequest request,
            @RequestBody String requestBody) {

        String userId = null;
        String authenticationCode = null;

        //  Extract JWT from the Authorization Header
        String jwtHeader = request.getHeader("Authorization");
        if (jwtHeader != null && jwtHeader.startsWith("Bearer ")) {
            String jwtToken = jwtHeader.substring(7); // Remove "Bearer " prefix
            try {
                userId = jsonWebTokenService.extractSubjectsUserId(jwtToken);
            } catch (Exception e) {
                userId = null; // JWT invalid or missing
            }
        }

        //  Extract Auth Code from the Request Body
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(requestBody);
            authenticationCode = jsonNode.get("authenticationCode").asText();
        } catch (Exception e) {
            throw new RuntimeException("Invalid request format: Missing authenticationCode");
        }

        //  Fetch user details and tokens separately
        Optional<oAuthUserDetails> userDetails = oAuthUserDetailsRepository.findById(userId);
        Optional<oAuthUserTokens> userTokens = oAuthUserTokensRepository.findById(userId);

        if (userDetails.isPresent() && userTokens.isPresent()) {
            oAuthUserTokens tokens = userTokens.get();
            String refreshToken = tokens.getRefreshToken();
            long expiresAt = tokens.getExpiresAt();

            //  Check if access token has expired
            if (System.currentTimeMillis() >= expiresAt) {
                if (refreshToken != null) {
                    // Refresh the access token
                    oAuthResponse refreshedTokens = googleAuthenticationService.refreshAccessToken(refreshToken);
                    tokens.setAccessToken(refreshedTokens.getAccess_token());
                    tokens.setExpiresAt(System.currentTimeMillis() + refreshedTokens.getExpires_in() * 1000L);
                    oAuthUserTokensRepository.save(tokens);

                    //  Generate a new JWT Token
                    String newJwt = jsonWebTokenService.generateToken(userDetails.get().getId());

                    //  Return JWT in the Authorization header
                    HttpHeaders headers = new HttpHeaders();
                    headers.set("Authorization", "Bearer " + newJwt);

                    return ResponseEntity.ok()
                            .headers(headers)
                            .body(refreshedTokens);
                } else {
                    throw new RuntimeException("Refresh token is missing. User must log in again.");
                }
            } else {
                //  Access token is still valid, return existing JWT
                String existingJwt = jsonWebTokenService.generateToken(userDetails.get().getId());

                //  Return JWT in the Authorization header
                HttpHeaders headers = new HttpHeaders();
                headers.set("Authorization", "Bearer " + existingJwt);

                return ResponseEntity.ok()
                        .headers(headers)
                        .body(new oAuthResponse(
                                tokens.getAccessToken(),
                                "Bearer",
                                String.valueOf((expiresAt - System.currentTimeMillis()) / 1000),
                                null,
                                null,
                                refreshToken
                        ));
            }
        } else {
            //  New user: exchange authentication code for tokens
            oAuthResponse newTokens = googleAuthenticationService.exchangeAuthenticationCodeForAccessToken(authenticationCode);
            oAuthUserDetails userDetailsData = googleAuthenticationService.getoAuthUserDetailsFromAccessToken(newTokens.getAccess_token());

            //  Save new user details
            oAuthUserDetails newUser = new oAuthUserDetails(
                    userDetailsData.getId(),
                    userDetailsData.getName(),
                    userDetailsData.getGivenName(),
                    userDetailsData.getFamilyName(),
                    userDetailsData.getEmail(),
                    userDetailsData.isVerifiedEmail(),
                    userDetailsData.getPicture()
            );
            oAuthUserDetailsRepository.save(newUser);

            //  Save new user tokens
            oAuthUserTokens newUserTokens = new oAuthUserTokens(
                    newUser.getId(),
                    newTokens.getAccess_token(),
                    newTokens.getRefresh_token(),
                    System.currentTimeMillis() + newTokens.getExpires_in() * 1000L
            );
            oAuthUserTokensRepository.save(newUserTokens);

            //  Generate a JWT Token for the new user
            String newJwt = jsonWebTokenService.generateToken(newUser.getId());

            //  Return JWT in the Authorization header
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + newJwt);

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(newTokens);
        }
    }
}
