package com.finalyearproject.bubble.Services.Authentication;

import com.finalyearproject.bubble.Entity.Authentication.oAuthUserDetails;
import com.finalyearproject.bubble.Objects.Authentication.oAuthResponse;

import org.springframework.beans.factory.annotation.Value;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.stream.Collectors;

import com.fasterxml.jackson.databind.ObjectMapper;

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


    /*
    When User successfully completes Google oAuth login we get the Authentication Code.
    We pass this Authentication Code to the token endpoint of the Google oAuth API.

    RETURNS : ACCESS TOKEN.
    USE : ACCESS TOKEN IS USED TO GET USER ACCOUNT INFORMATION.
     */
    public oAuthResponse exchangeAuthenticationCodeForAccessToken(String authenticationCode) {


        String authenticationCodeExchangeUrl = "https://oauth2.googleapis.com/token";

        try {
            // Create the HTTP client to handle request
            HttpClient httpClient = HttpClient.newHttpClient();

            // Prepare request body as a form-urlencoded string
            Map<String, String> params = Map.of(
                    "code", authenticationCode,
                    "redirect_uri", redirectUrl,
                    "client_id", clientId,
                    "client_secret", clientSecret,
                    "grant_type", "authorization_code"
            );

            // Distinguish KEY = VALUE and split each using &.
            String requestBody = params.entrySet().stream()
                    .map(entry -> URLEncoder.encode(entry.getKey(), StandardCharsets.UTF_8) + "=" +
                            URLEncoder.encode(entry.getValue(), StandardCharsets.UTF_8))
                    .collect(Collectors.joining("&"));

            // Build the HTTP request to get the Access Token
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(authenticationCodeExchangeUrl))
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            // Send HTTP request
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            // Response of 200 indicates success
            if (response.statusCode() == 200) {
                // Map the response body into oAuthResponse
                ObjectMapper objectMapper = new ObjectMapper();
                return objectMapper.readValue(response.body(), oAuthResponse.class);
            } else {
                throw new RuntimeException("Failed to exchange code. HTTP Status: " + response.statusCode());
            }
        } catch (Exception e) {
            throw new RuntimeException("Error during token exchange", e);
        }
    }

    /*
    Using the Users Access token we can query the oAuth API and return the fields associated with the users account.

    RETURNS : All details about a Users account.
    USE : We use this information to populate the accounts when they are created.
     */

    public oAuthUserDetails getoAuthUserDetailsFromAccessToken(String accessToken) {
        String userInfoExchangeURL = "https://www.googleapis.com/oauth2/v2/userinfo";

        try {
            // Create an HTTP client to handle request.
            HttpClient httpClient = HttpClient.newHttpClient();

            // Build the GET request with Authorization header
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(userInfoExchangeURL))
                    .header("Authorization", "Bearer " + accessToken)
                    .GET()
                    .build();

            // Send the request and get the response
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            // Response of 200 indicates success
            if (response.statusCode() == 200) {
                // Map the response body to the oAuthUserDetails object
                ObjectMapper objectMapper = new ObjectMapper();
                return objectMapper.readValue(response.body(), oAuthUserDetails.class);
            } else {
                throw new RuntimeException("Failed to retrieve user profile. HTTP Status: " + response.statusCode());
            }
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving user profile details from Google", e);
        }

    }

    public boolean checkIfUserAccessTokenIsExpired(String userID){
        return false;
    }

}