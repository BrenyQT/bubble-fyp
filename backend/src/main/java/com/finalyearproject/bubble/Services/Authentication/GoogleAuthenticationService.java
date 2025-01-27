package com.finalyearproject.bubble.Services.Authentication;

import org.springframework.beans.factory.annotation.Value;

public class GoogleAuthenticationService {

    // Google oAuth client ID (.env)
    private final String clientId;

    // Google oAuth client Secret (.env)
    private final String clientSecret;

    // Redirect URL once Google oAuth is successful
    private final String redirectUrl;


public GoogleAuthenticationService(
        @Value("${GOOGLE_CLIENT_ID}") String clientId,
        @Value("${GOOGLE_CLIENT_SECRET}") String clientSecret,
        @Value("${OAUTH_SUCCESS_REDIRECT_URL}") String redirectUrl)
         {
             this.clientId = clientId;
             this.clientSecret = clientSecret;
             this.redirectUrl = redirectUrl;
         }
}