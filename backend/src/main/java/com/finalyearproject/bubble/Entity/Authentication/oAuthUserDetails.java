package com.finalyearproject.bubble.Entity.Authentication;


/*
Users Access token is used to derive their account details.
This helps me fill profile fields automatically.
 */

public class oAuthUserDetails {

    private final String id;
    private final String name;
    private final String givenName;
    private final String familyName;
    private final String email;
    private final boolean verifiedEmail;
    private final String picture;

    // Constructor
    public oAuthUserDetails(String id, String name, String givenName, String familyName, String email, boolean verifiedEmail, String picture) {
        // TO:DO = apparently this can be used as a UUID for a user : look into it.
        this.id = id;
        this.name = name;
        this.givenName = givenName;
        this.familyName = familyName;
        this.email = email;
        this.verifiedEmail = verifiedEmail;
        this.picture = picture;
    }

    // Getters (Immutable)
    public String getId() { return id; }
    public String getName() { return name; }
    public String getGivenName() { return givenName; }
    public String getFamilyName() { return familyName; }
    public String getEmail() { return email; }
    public boolean isVerifiedEmail() { return verifiedEmail; }
    public String getPicture() { return picture; }
}


