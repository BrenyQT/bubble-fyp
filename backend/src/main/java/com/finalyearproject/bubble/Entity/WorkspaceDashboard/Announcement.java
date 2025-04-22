package com.finalyearproject.bubble.Entity.WorkspaceDashboard;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.finalyearproject.bubble.Entity.Authentication.oAuthUserDetails;
import com.finalyearproject.bubble.Entity.Workspaces.Workspaces;

import jakarta.persistence.*;

import java.util.Date;

@Entity
public class Announcement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    // keeps infinitely parsing
    @JsonBackReference // if this doesnt know try to use the JSON Ignore
    private Workspaces workspace;

    @ManyToOne
    private oAuthUserDetails author;

    private String content;

    private Date createdAt;

    public Announcement() {}

    public Announcement(Workspaces workspace, oAuthUserDetails author, String content, Date createdAt) {
        this.workspace = workspace;
        this.author = author;
        this.content = content;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public Workspaces getWorkspace() { return workspace; }

    public void setWorkspace(Workspaces workspace) { this.workspace = workspace; }

    public oAuthUserDetails getAuthor() { return author; }

    public void setAuthor(oAuthUserDetails author) { this.author = author; }

    public String getContent() { return content; }

    public void setContent(String content) { this.content = content; }
    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
}
