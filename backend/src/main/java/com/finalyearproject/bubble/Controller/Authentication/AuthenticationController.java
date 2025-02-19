package com.finalyearproject.bubble.Controller.Authentication;

import com.finalyearproject.bubble.Entity.Authentication.oAuthUserDetails;
import com.finalyearproject.bubble.Repository.Authentication.oAuthUserDetailsRepository;
import com.finalyearproject.bubble.Services.Authentication.AuthenticationService;
import com.finalyearproject.bubble.Services.Authentication.JsonWebTokenService;
import jakarta.servlet.http.HttpServletResponse;
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

    @GetMapping("/authentication")
    public ResponseEntity<?> authenticateUser(@RequestParam("code") String code) {
        try {
            oAuthUserDetails user = authenticationService.authenticateUser(code);
            String jwtToken = jsonWebTokenService.generateToken(user.getEmail());

            ResponseCookie jwtCookie = ResponseCookie.from("jwt", jwtToken)
                    .httpOnly(true)
                    .secure(false)
                    .path("/")
                    .maxAge(3600)
                    .sameSite("Lax")
                    .build();

            return ResponseEntity.status(302)
                    .header("Set-Cookie", jwtCookie.toString())
                    .location(URI.create("http://localhost:3000/Workspace"))
                    .build();

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Authentication failed: " + e.getMessage());
        }
    }
    @GetMapping("/user")
    public ResponseEntity<?> getUserFromJWT(@CookieValue(name = "jwt", required = false) String jwtToken) {
        if (jwtToken == null || jwtToken.isEmpty()) {
            return ResponseEntity.status(401).body("Unauthorized: No JWT token found");
        }

        try {
            // Extract user email from JWT
            String email = jsonWebTokenService.extractEmail(jwtToken);

            // Fetch user details from database/service
            Optional<oAuthUserDetails> user = oAuthUserDetailsRepository.findByEmail(email);
            if (!user.isPresent()) {
                return ResponseEntity.status(404).body("User not found");
            }

            return ResponseEntity.ok(user.get()); // Return user object

        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid or expired token: " + e.getMessage());
        }
    }


}
