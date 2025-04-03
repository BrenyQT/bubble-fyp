package com.finalyearproject.bubble.Entity.WorkspaceDashboard;

import jakarta.persistence.*;
import java.util.Date;


// TO:DO : messed around with storing ids not objs
@Entity
@Table(name = "todo")
public class TodoTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // id of a todotask

    @Column(name = "user_id", nullable = false)
    private String userId; // user id

    @Column(name = "workspace_id", nullable = false)
    private int workspaceId; // workspace id

    @Column(nullable = false)
    private String task; // task title

    @Column(nullable = false)
    private boolean completed = false; // completed for green eefect

    @Column(nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt = new Date(); // isntant ticket is created

    // Constructors
    public TodoTask() {}

    public TodoTask(String userId, int workspaceId, String task) {
        this.userId = userId;
        this.workspaceId = workspaceId;
        this.task = task;
    }

    // get and set
    public Long getId() { return id; }
    public String getUserId() { return userId; }
    public int getWorkspaceId() { return workspaceId; }
    public String getTask() { return task; }
    public boolean isCompleted() { return completed; }
    public Date getCreatedAt() { return createdAt; }

    public void setUserId(String userId) { this.userId = userId; }
    public void setTask(String task) { this.task = task; }
    public void setCompleted(boolean completed) { this.completed = completed; }
}
