package com.finalyearproject.bubble.Entity.BacklogManagement;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.finalyearproject.bubble.Entity.Authentication.oAuthUserDetails;
import com.finalyearproject.bubble.Entity.SprintBacklog.Sprint;
import com.finalyearproject.bubble.Entity.Workspaces.Workspaces;
import jakarta.persistence.*;

import java.util.Date;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})  // Added to avoid serialisation issues with lazy loading
@Entity
@Table(name = "tickets")
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // ID of ticket

    private int ticketNumber; // Number of ticket for a workspace

    private String name; // name of ticket

    private String description; // description

    private String label; // Label for the type of ticket (bug, security ....)

    @ManyToOne
    @JoinColumn(name = "workspace_id")
    private Workspaces workspace; // Workspace where ticket is

    @ManyToOne
    @JoinColumn(name = "created_by_id")
    private oAuthUserDetails createdBy; // User who created Ticket

    @ManyToOne
    @JoinColumn(name = "assigned_to_id")
    private oAuthUserDetails assignedTo; // user who has taken on ticket

    private boolean highPriority; // set ticket priority

    @ManyToOne(fetch = FetchType.LAZY)  // Lazy fetch for sprint association
    @JoinColumn(name = "sprint_id")
    @JsonBackReference  // Prevents infinite recursion when serializing bidirectional relationships
    private Sprint sprint; // Sprint which ticket is a part of

    private Date createdAt; // the moment ticket is created

    private boolean completed; // completed tickets

    private String status; // Where on the kanban board the ticket is

    // Constructors
    public Ticket() {}

    public Ticket(String name, String description, String label, oAuthUserDetails createdBy,
                  oAuthUserDetails assignedTo, Workspaces workspace, boolean highPriority, String status) {
        this.name = name;
        this.description = description;
        this.label = label;
        this.createdBy = createdBy;
        this.assignedTo = assignedTo;
        this.workspace = workspace;
        this.highPriority = highPriority;
        this.status = status;
        this.completed = false;
        this.createdAt = new Date();
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public int getTicketNumber() { return ticketNumber; }
    public void setTicketNumber(int ticketNumber) { this.ticketNumber = ticketNumber; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }
    public Workspaces getWorkspace() { return workspace; }
    public void setWorkspace(Workspaces workspace) { this.workspace = workspace; }
    public oAuthUserDetails getCreatedBy() { return createdBy; }
    public void setCreatedBy(oAuthUserDetails createdBy) { this.createdBy = createdBy; }
    public oAuthUserDetails getAssignedTo() { return assignedTo; }
    public void setAssignedTo(oAuthUserDetails assignedTo) { this.assignedTo = assignedTo; }
    public boolean isHighPriority() { return highPriority; }
    public void setHighPriority(boolean highPriority) { this.highPriority = highPriority; }
    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }
    public Sprint getSprint() { return sprint; }
    public void setSprint(Sprint sprint) { this.sprint = sprint; }
    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
