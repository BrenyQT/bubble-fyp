package com.finalyearproject.bubble.Entity.SprintBacklog;

import com.finalyearproject.bubble.Entity.BacklogManagement.Ticket;
import com.finalyearproject.bubble.Entity.Authentication.oAuthUserDetails;
import com.finalyearproject.bubble.Entity.Workspaces.Workspaces;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "sprints")
public class Sprint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id; // Sprint ID

    private String name; // Title/Name of a sprint

    private String goal; // A goal which a sprint wishes to achieve

    private boolean completed; // if completed load in completed sprints

    private boolean current; // populates current sprint kanban is current set as active

    @ManyToOne
    @JoinColumn(name = "created_by")
    private oAuthUserDetails createdBy; // sets the user who created

    @ManyToOne
    @JoinColumn(name = "workspace_id")
    private Workspaces workspace; // sets the workspace of creation

    @OneToMany(mappedBy = "sprint", cascade = CascadeType.ALL)
    private List<Ticket> tickets; // lsit of tickets

    public Sprint() {
        this.current = false;  // Default value
    }

    public Sprint(String name, String goal, boolean completed, boolean current, Workspaces workspace, oAuthUserDetails createdBy) {
        this.name = name;
        this.goal = goal;
        this.completed = completed;
        this.current = current;
        this.workspace = workspace;
        this.createdBy = createdBy;
    }

    // Getters and Setters
    public int getId() { return id; }

    public String getName() { return name; }

    public String getGoal() { return goal; }

    public boolean isCompleted() { return completed; }

    public boolean isCurrent() { return current; }

    public Workspaces getWorkspace() { return workspace; }

    public oAuthUserDetails getCreatedBy() { return createdBy; }

    public List<Ticket> getTickets() { return tickets; }

    public void setId(int id) { this.id = id; }

    public void setName(String name) { this.name = name; }

    public void setGoal(String goal) { this.goal = goal; }

    public void setCompleted(boolean completed) { this.completed = completed; }

    public void setCurrent(boolean current) { this.current = current; }

    public void setWorkspace(Workspaces workspace) { this.workspace = workspace; }

    public void setCreatedBy(oAuthUserDetails createdBy) { this.createdBy = createdBy; }

    public void setTickets(List<Ticket> tickets) { this.tickets = tickets; }
}
