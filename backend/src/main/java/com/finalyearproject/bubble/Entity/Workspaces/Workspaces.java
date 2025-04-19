package com.finalyearproject.bubble.Entity.Workspaces;

import com.finalyearproject.bubble.Entity.Authentication.oAuthUserDetails;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;


// TO:DO start again because its not parsin properly
@Entity
@Table(name = "workspaces")
public class Workspaces {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(columnDefinition = "TEXT")
    private String image;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, length = 100)
    private String bio;

    @Column(nullable = false, unique = true)
    private String code;

    @ManyToMany
    @JoinTable(
            name = "workspace_users",
            joinColumns = @JoinColumn(name = "workspace_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<oAuthUserDetails> users = new ArrayList<>();

    public Workspaces() {}

    public Workspaces(int id, String image, String name, String bio, List<oAuthUserDetails> users, String code) {
        this.id = id;
        this.image = image;
        this.name = name;
        this.bio = bio;
        this.users = users != null ? users : new ArrayList<>();
        this.code = code;
    }

    public int getId() { return id; }
    public String getImage() { return image; }
    public String getName() { return name; }
    public String getBio() { return bio; }
    public List<oAuthUserDetails> getUsers() { return users; }
    public String getCode() { return code; }

    public void addUser(oAuthUserDetails user) {
        if (!this.users.contains(user)) {
            this.users.add(user);
        }
    }
    // removing
    public void removeUser(oAuthUserDetails user) {
        this.users.remove(user);
    }
}
