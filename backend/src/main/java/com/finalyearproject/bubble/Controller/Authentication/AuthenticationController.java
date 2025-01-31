package com.finalyearproject.bubble.Controller.Authentication;

import com.finalyearproject.bubble.Objects.Authentication.oAuthResponse;
import com.finalyearproject.bubble.Services.Authentication.AuthenticationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

@RestController
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    public AuthenticationController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @GetMapping("/authentication")
    public ResponseEntity<oAuthResponse> handleGoogleOAuth(
            @RequestParam("code") String authenticationCode,
            HttpServletRequest request) {
        return authenticationService.handleOAuth(request, authenticationCode);
    }

    @GetMapping("/ping")
    public String handlePing() {
        return "pong";
    }
}
