
// --- oAuthUserDetails.java ---
package com.finalyearproject.bubble.Entity.Authentication;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "oauth_user_details")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@JsonInclude(JsonInclude.Include.NON_NULL)
public class oAuthUserDetails {

    @Id
    @Column(unique = true, nullable = false, updatable = false)
    private String id; // Not a number a string (REMEMBER)

    @Column(nullable = false)
    private String name;

    @JsonProperty("given_name")
    @Column(nullable = false)
    private String givenName;

    @JsonProperty("family_name")
    @Column(nullable = false)
    private String familyName;

    @Column(nullable = false, unique = true)
    private String email;

    @JsonProperty("verified_email")
    @Column(nullable = false)
    private boolean verifiedEmail;

    @Column(nullable = false)
    private String picture;

    public oAuthUserDetails() {} // Default constructor for JPA

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

    public String getId() { return id; }
    public String getName() { return name; }
    public String getGivenName() { return givenName; }
    public String getFamilyName() { return familyName; }
    public String getEmail() { return email; }
    public boolean isVerifiedEmail() { return verifiedEmail; }
    public String getPicture() { return picture; }

    public void setName(String name) { this.name = name; }
    public void setGivenName(String givenName) { this.givenName = givenName; }
    public void setFamilyName(String familyName) { this.familyName = familyName; }
    public void setEmail(String email) { this.email = email; }
    public void setVerifiedEmail(boolean verifiedEmail) { this.verifiedEmail = verifiedEmail; }
    public void setPicture(String picture) { this.picture = picture; }

    @Override
    public String toString() {
        return "oAuthUserDetails{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", givenName='" + givenName + '\'' +
                ", familyName='" + familyName + '\'' +
                ", email='" + email + '\'' +
                ", verifiedEmail=" + verifiedEmail +
                ", picture='" + picture + '\'' +
                '}';
    }

    @JsonIgnore
    public boolean isEmailVerified() { return verifiedEmail; } // ignore redundant field TO:DO test to see can i map without this field
}
