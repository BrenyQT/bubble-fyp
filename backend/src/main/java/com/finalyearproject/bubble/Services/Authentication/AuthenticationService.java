package com.finalyearproject.bubble.Services.Authentication;

public class AuthenticationService {

    // Google oAuth Service
    private final GoogleAuthenticationService googleAuthenticationService;

    // Json Web Token Service
    private final JsonWebTokenService jwtService ;

    // This service combines the functionality of both the Google oAuth Service and the Json Web Token Service
    public AuthenticationService(GoogleAuthenticationService googleAuthenticationService, JsonWebTokenService jwtService) {
        this.googleAuthenticationService = googleAuthenticationService;
        this.jwtService = jwtService;
    }

    // Method for handling entire Authentication logic
    public void handleAuthenticationOfAnyUser(){

    }
}
