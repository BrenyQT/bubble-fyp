package com.finalyearproject.bubble.Entity.Authentication;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/*
Users Access token is used to derive their account details.
This helps me fill profile fields automatically and manage authentication.
*/

@Entity
@Table(name = "oauth_user_details") // Maps to a table in your database
public class oAuthUserDetails {

    @Id
    private String id; // Unique Google User ID (can be treated as UUID)

    private String name;
    private String givenName;
    private String familyName;
    private String email;
    private boolean verifiedEmail;
    private String picture;

    // Default constructor for JPA
    public oAuthUserDetails() {}

    // Constructor
    public oAuthUserDetails(String id, String name, String givenName, String familyName, String email,
                            boolean verifiedEmail, String picture) {
        this.id = id;
        this.name = name;
        this.givenName = givenName;
        this.familyName = familyName;
        this.email = email;
        this.verifiedEmail = verifiedEmail;
        this.picture = picture;

    }

    // Getters
    public String getId() { return id; }
    public String getName() { return name; }
    public String getGivenName() { return givenName; }
    public String getFamilyName() { return familyName; }
    public String getEmail() { return email; }
    public boolean isVerifiedEmail() { return verifiedEmail; }
    public String getPicture() { return picture; }


    // Setters
    public void setId(String id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setGivenName(String givenName) { this.givenName = givenName; }
    public void setFamilyName(String familyName) { this.familyName = familyName; }
    public void setEmail(String email) { this.email = email; }
    public void setVerifiedEmail(boolean verifiedEmail) { this.verifiedEmail = verifiedEmail; }
    public void setPicture(String picture) { this.picture = picture; }

}
