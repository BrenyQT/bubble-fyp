package com.finalyearproject.bubble.Entity.Workspaces;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.finalyearproject.bubble.Entity.Authentication.oAuthUserDetails;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

/*
Entity is mapped to a database
specified the db name
*/
@Entity
@Table(name = "workspaces")

public class Workspaces {

    @Id // Primary key  starts at 1 and ++
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(columnDefinition = "TEXT") // This might work please
    private String image;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false, length = 100)
    private String bio;

    @Column(nullable = false, unique = true)
    private String code;

    /*
    Many Users can be in many workspaces
    Create a table which combines user id and workspace id

     */
    @ManyToMany
    @JoinTable(
            name = "workspace_users",
            joinColumns = @JoinColumn(name = "workspace_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<oAuthUserDetails> users = new ArrayList<>();

    //Default Constructor
    public Workspaces() {
        this.users = new ArrayList<>();
    }

    //Row Constructor
    public Workspaces(int id, String image, String name, String bio, List<oAuthUserDetails> users, String code) {
        this.id = id;
        this.image = image;
        this.name = name;
        this.bio = bio;
        this.users = (users != null) ? users : new ArrayList<>(); // Ensure it's not null
        this.code = code;
    }

    // Getters
    public int getId() {
        return id;
    }

    public String getImage() {
        return image;
    }

    public String getName() {
        return name;
    }

    public String getBio() {
        return bio;
    }

    public List<oAuthUserDetails> getUsers() {
        return users;
    }

    public String getCode() {
        return code;
    }
    // Checks is user exists in a workspace
    public void addUser(oAuthUserDetails user) {
        if (!this.users.contains(user)) {
            this.users.add(user);
        }
    }
}
