package com.finalyearproject.bubble.Entity.WorkspaceChat;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.finalyearproject.bubble.Entity.Workspaces.Workspaces;
import com.finalyearproject.bubble.Entity.Authentication.oAuthUserDetails;
import jakarta.persistence.*;

import java.util.Date;


@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) // Problems loading messages lazy loading helps
@Entity
@Table(name = "messages")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(fetch = FetchType.EAGER) // Many Messages to a user
    @JoinColumn(name = "sender_id", nullable = false)
    private oAuthUserDetails sender;

    @ManyToOne(fetch = FetchType.EAGER) // Many Messages to a workspace
    @JoinColumn(name = "workspace_id", nullable = false)
    private Workspaces workspace;

    @Column(nullable = false, length = 500)
    private String content;

    @Column(nullable = false)
    private Date timestamp;

    public Message() {}

    public Message(oAuthUserDetails sender, Workspaces workspace, String content, Date timestamp) {
        this.sender = sender;
        this.workspace = workspace;
        this.content = content;
        this.timestamp = timestamp;
    }

    public int getId() { return id; }
    public oAuthUserDetails getSender() { return sender; }
    public Workspaces getWorkspace() { return workspace; }
    public String getContent() { return content; }
    public Date getTimestamp() { return timestamp; }

    public void setSender(oAuthUserDetails sender) { this.sender = sender; }
    public void setWorkspace(Workspaces workspace) { this.workspace = workspace; }
    public void setContent(String content) { this.content = content; }
    public void setTimestamp(Date timestamp) { this.timestamp = timestamp; }
}
