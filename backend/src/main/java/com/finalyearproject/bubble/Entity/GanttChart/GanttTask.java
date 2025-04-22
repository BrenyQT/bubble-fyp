package com.finalyearproject.bubble.Entity.GanttChart;

import com.finalyearproject.bubble.Entity.Workspaces.Workspaces;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
public class GanttTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String label;

    private LocalDate startDate;

    private LocalDate endDate;

    private String color;

    @ManyToOne // parsing fix ?
    @JoinColumn(name = "workspace_id")
    private Workspaces workspace;

    public GanttTask() {}

    public GanttTask(String label, LocalDate startDate, LocalDate endDate, String color, Workspaces workspace) {
        this.label = label;
        this.startDate = startDate;
        this.endDate = endDate;
        this.color = color;
        this.workspace = workspace;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public String getLabel() { return label; }
    public LocalDate getStartDate() { return startDate; }
    public LocalDate getEndDate() { return endDate; }
    public String getColor() { return color; }
    public Workspaces getWorkspace() { return workspace; }

    public void setId(Long id) { this.id = id; }
    public void setLabel(String label) { this.label = label; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public void setColor(String color) { this.color = color; }
    public void setWorkspace(Workspaces workspace) { this.workspace = workspace; }
}

