package com.finalyearproject.bubble.Services.Authentication;

import com.finalyearproject.bubble.Entity.Authentication.oAuthUserDetails;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class GoogleAuthenticationService {

    private final String clientId;
    private final String clientSecret;
    private final String redirectUri;
    private final HttpClient httpClient;

    // Constructor with Loaded in secrets
    public GoogleAuthenticationService(
            @Value("${GOOGLE_CLIENT_ID}") String clientId,
            @Value("${GOOGLE_CLIENT_SECRET}") String clientSecret,
            @Value("${OAUTH_SUCCESS_REDIRECT_URL}") String redirectUri) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.redirectUri = redirectUri;
        this.httpClient = HttpClient.newHttpClient();
    }

    /*
     When Grant code is given as a param from redirect we want to use it to get the access token

     Creates a Map for request body
     URL encoded string Format

     Get access token from response
     */
    public String exchangeCodeForAccessToken(String authCode) throws Exception {
        // Static Google URL
        String tokenUrl = "https://oauth2.googleapis.com/token";

        Map<String, String> parameters = new HashMap<>();
        parameters.put("code", authCode);
        parameters.put("client_id", clientId);
        parameters.put("client_secret", clientSecret);
        parameters.put("redirect_uri", redirectUri);
        parameters.put("grant_type", "authorization_code");

        String requestBody = parameters.entrySet().stream()
                .map(entry -> entry.getKey() + "=" + entry.getValue())
                .collect(Collectors.joining("&"));

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(tokenUrl))
                .header("Content-Type", "application/x-www-form-urlencoded")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> responseMap = objectMapper.readValue(response.body(), Map.class);

        return (String) responseMap.get("access_token");
    }

    /*
    Update URL to include access token
    Returns oAUthUser Object
    */
    public oAuthUserDetails fetchUserProfile(String accessToken) throws Exception {
        // Static Google URL
        String userInfoUrl = "https://www.googleapis.com/oauth2/v2/userinfo";

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(userInfoUrl + "?access_token=" + accessToken))
                .header("Authorization", "Bearer " + accessToken) // TO:DO : JWT HERE ??
                .GET()
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.readValue(response.body(), oAuthUserDetails.class);
    }
}
