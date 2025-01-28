package com.finalyearproject.bubble.Services.Authentication;

public class AuthenticationService {

    // Google oAuth Service
    private final GoogleAuthenticationService googleAuthenticationService;

    // Json Web Token Service
    private final JsonWebTokenService jsonWebTokenService ;

    // This service combines the functionality of both the Google oAuth Service and the Json Web Token Service
    public AuthenticationService(GoogleAuthenticationService googleAuthenticationService, JsonWebTokenService jsonWebTokenService) {
        this.googleAuthenticationService = googleAuthenticationService;
        this.jsonWebTokenService = jsonWebTokenService;
    }

    // Method for handling entire Authentication logic
    public void oAuthAndJsonWebTokenHandler(){

    }
}
