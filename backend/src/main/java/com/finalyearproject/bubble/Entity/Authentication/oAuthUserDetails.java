package com.finalyearproject.bubble.Entity.Authentication;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

/*
Entity is mapped to a database
specified the db name
*/
@Entity
@Table(name = "oauth_user_details")
public class oAuthUserDetails {

    @Id // Primary Key (unique and value)
    @Column(unique = true, nullable = false)
    private String id;

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

    // Default constructor for JPA
    public oAuthUserDetails() {
    }

    // Row Constructor
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

    // Getter, Setters, TO String
    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getGivenName() {
        return givenName;
    }

    public void setGivenName(String givenName) {
        this.givenName = givenName;
    }

    public String getFamilyName() {
        return familyName;
    }

    public void setFamilyName(String familyName) {
        this.familyName = familyName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isVerifiedEmail() {
        return verifiedEmail;
    }

    public void setVerifiedEmail(boolean verifiedEmail) {
        this.verifiedEmail = verifiedEmail;
    }

    public String getPicture() {
        return picture;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }

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

}
