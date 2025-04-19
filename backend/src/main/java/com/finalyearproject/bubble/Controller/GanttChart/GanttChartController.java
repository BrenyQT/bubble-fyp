package com.finalyearproject.bubble.Controller.GanttChart;

import com.finalyearproject.bubble.Entity.GanttTask;
import com.finalyearproject.bubble.Entity.Workspaces.Workspaces;
import com.finalyearproject.bubble.Repository.GanttTaskRepository;
import com.finalyearproject.bubble.Repository.Workspaces.WorkspacesRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/gantt")
public class GanttChartController {

    private final GanttTaskRepository ganttTaskRepository;
    private final WorkspacesRepository workspacesRepository;

    public GanttChartController(GanttTaskRepository ganttTaskRepository, WorkspacesRepository workspacesRepository) {
        this.ganttTaskRepository = ganttTaskRepository;
        this.workspacesRepository = workspacesRepository;
    }



    // Gets the Gant Chart tasks for a praticular workspace
    @GetMapping("/{workspaceId}")
    public List<GanttTask> getGanttChartTasksForWorkspace(@PathVariable Long workspaceId) {

        Workspaces workspace = workspacesRepository.findById(workspaceId)
                .orElseThrow(() -> new RuntimeException("cant find workspace /gantt"));


        return ganttTaskRepository.findByWorkspace(workspace);
    }


    // Saves a Gantt chart task to db
    @PostMapping("/add")
    public GanttTask addGanttChartTask(@RequestBody GanttTask task) {

        if(task.getColor() == null) {
            task.setColor("#3498db"); // defualt blue im follwing the problem of this not being set
        }

        return ganttTaskRepository.save(task); // save to DB
    }



    //delete a task using its ID
    @DeleteMapping("/delete/{id}")
    public void deleteTask(@PathVariable Long id) {
        ganttTaskRepository.deleteById(id); // delete
    }




}
