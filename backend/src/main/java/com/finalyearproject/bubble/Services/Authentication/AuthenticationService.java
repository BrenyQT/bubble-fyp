package com.finalyearproject.bubble.Services.Authentication;

import com.finalyearproject.bubble.Entity.Authentication.oAuthUserDetails;
import com.finalyearproject.bubble.Repository.Authentication.oAuthUserDetailsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthenticationService {

    private final GoogleAuthenticationService googleAuthenticationService;
    private final oAuthUserDetailsRepository userDetailsRepository;

    @Autowired
    public AuthenticationService(GoogleAuthenticationService googleAuthenticationService,
                                 oAuthUserDetailsRepository userDetailsRepository) {
        this.googleAuthenticationService = googleAuthenticationService;
        this.userDetailsRepository = userDetailsRepository;
    }

    public oAuthUserDetails authenticateUser(String authCode) throws Exception {

        // Exchange Grant Code for Access
        String accessToken = googleAuthenticationService.exchangeCodeForAccessToken(authCode);

        // Get the Users details
        oAuthUserDetails googleUser = googleAuthenticationService.fetchUserProfile(accessToken);

        // Query, Create or Update User Row
        Optional<oAuthUserDetails> existingUser = userDetailsRepository.findById(googleUser.getId());

        // Updating the existing user fields
        if (existingUser.isPresent()) {
            oAuthUserDetails user = existingUser.get();
            user.setName(googleUser.getName());
            user.setGivenName(googleUser.getGivenName());
            user.setFamilyName(googleUser.getFamilyName());
            user.setEmail(googleUser.getEmail());
            user.setVerifiedEmail(googleUser.isVerifiedEmail());
            user.setPicture(googleUser.getPicture());
            return userDetailsRepository.save(user);
        } else {
            // Save the orignal account without chnages
            return userDetailsRepository.save(googleUser);
        }
    }
}
