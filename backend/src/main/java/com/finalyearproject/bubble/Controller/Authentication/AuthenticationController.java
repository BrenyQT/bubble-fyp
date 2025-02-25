package com.finalyearproject.bubble.Controller.Authentication;

import com.finalyearproject.bubble.Entity.Authentication.oAuthUserDetails;
import com.finalyearproject.bubble.Repository.Authentication.oAuthUserDetailsRepository;
import com.finalyearproject.bubble.Services.Authentication.AuthenticationService;
import com.finalyearproject.bubble.Services.Authentication.JsonWebTokenService;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.Optional;

@RestController
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private final JsonWebTokenService jsonWebTokenService;
    private final com.finalyearproject.bubble.Repository.Authentication.oAuthUserDetailsRepository oAuthUserDetailsRepository;

    public AuthenticationController(AuthenticationService authenticationService, JsonWebTokenService jsonWebTokenService, oAuthUserDetailsRepository oAuthUserDetailsRepository) {
        this.authenticationService = authenticationService;
        this.jsonWebTokenService = jsonWebTokenService;
        this.oAuthUserDetailsRepository = oAuthUserDetailsRepository;
    }

    /*
    Sends a GET Request to /authentication

    Expects code as a request param in url
    Checks if user exists or adds them to db

    Creates a new JWT from the users email

    Cookie "jwt" which stores token


    */
    @GetMapping("/authentication")
    public ResponseEntity<?> authenticateUser(@RequestParam("code") String code) {
        try {
            oAuthUserDetails user = authenticationService.authenticateUser(code);
            String jwtToken = jsonWebTokenService.generateToken(user.getEmail());

            ResponseCookie jwtCookie = ResponseCookie.from("jwt", jwtToken)
                    .httpOnly(true) // Reduces the risk of XSS attacks ??
                    .secure(false)
                    .path("/") // Allow all endpoints
                    .maxAge(3600) // 1 hour
                    .sameSite("Lax") // CSRF attacks ??
                    .build();


            // Request entity Object  : Creates a Http Payload
            // 302 : Found (Redirect Success)
            // JWT is added to redirect header
            // Redirect to workspace
            // Returns a 500 error
            return ResponseEntity.status(302)
                    .header("Set-Cookie", jwtCookie.toString())
                    .location(URI.create("http://localhost:3000/Workspace"))
                    .build();

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Authentication failed !! : " + e.getMessage());
        }
    }

    /*
    Sends a GET Request to /user

    Attempts to get cookies from oncoming request (not required).
    401 : Unauthorised
    */
    @GetMapping("/user")
    public ResponseEntity<?> getUserFromJWT(@CookieValue(name = "jwt", required = false) String jwtToken) {
        if (jwtToken == null || jwtToken.isEmpty()) {
            return ResponseEntity.status(401).body("Unauthorized: No JWT token found ?? ");
        }

        try {
            // Extract user email from JWT
            String email = jsonWebTokenService.extractEmail(jwtToken);

            // Checks if user exists in the database Optional ??
            // 404 Server cannot find resource (User doesn't exist)
            Optional<oAuthUserDetails> user = oAuthUserDetailsRepository.findByEmail(email);
            if (!user.isPresent()) {
                return ResponseEntity.status(404).body("User not found ??");
            }

            return ResponseEntity.ok(user.get()); // Return user object

            // If JWT Service cant get user email
            // 401 : Unauthorised
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid or expired token: " + e.getMessage());
        }
    }


}
