package com.finalyearproject.bubble.Controller.Authentication;

import com.finalyearproject.bubble.Entity.Authentication.oAuthUserDetails;
import com.finalyearproject.bubble.Services.Authentication.AuthenticationService;
import com.finalyearproject.bubble.Services.Authentication.JsonWebTokenService;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private final JsonWebTokenService jsonWebTokenService;

    public AuthenticationController(AuthenticationService authenticationService, JsonWebTokenService jsonWebTokenService) {
        this.authenticationService = authenticationService;
        this.jsonWebTokenService = jsonWebTokenService;
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
                    .header("Set-Cookie", user.toString())
                    .location(URI.create("http://localhost:3000/Workspace"))
                    .build();

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Authentication failed: " + e.getMessage());
        }
    }
}
