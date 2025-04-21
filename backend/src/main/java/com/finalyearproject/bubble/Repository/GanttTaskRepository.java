package com.finalyearproject.bubble.Repository;

import com.finalyearproject.bubble.Entity.GanttChart.GanttTask;
import com.finalyearproject.bubble.Entity.Workspaces.Workspaces;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GanttTaskRepository extends JpaRepository<GanttTask, Long> {
    // get the tasks using the workspace
    List<GanttTask> findByWorkspace(Workspaces workspace);
}
