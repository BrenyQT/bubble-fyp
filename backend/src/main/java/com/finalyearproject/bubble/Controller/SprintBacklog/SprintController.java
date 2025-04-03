package com.finalyearproject.bubble.Controller.SprintBacklog;

import com.finalyearproject.bubble.Entity.Authentication.oAuthUserDetails;
import com.finalyearproject.bubble.Entity.SprintBacklog.Sprint;
import com.finalyearproject.bubble.Entity.Workspaces.Workspaces;
import com.finalyearproject.bubble.Repository.Authentication.oAuthUserDetailsRepository;
import com.finalyearproject.bubble.Repository.SprintBacklog.SprintRepository;
import com.finalyearproject.bubble.Repository.Workspaces.WorkspacesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sprints")
public class SprintController {

    private final SprintRepository sprintRepository;
    private final oAuthUserDetailsRepository userRepository;
    private final WorkspacesRepository workspaceRepository;

    @Autowired
    public SprintController(SprintRepository sprintRepository,
                            oAuthUserDetailsRepository userRepository,
                            WorkspacesRepository workspaceRepository) {
        this.sprintRepository = sprintRepository;
        this.userRepository = userRepository;
        this.workspaceRepository = workspaceRepository;
    }

    // Retirieve all sprints via workspace ID
    @GetMapping("/getSprints/{workspaceId}")
    public List<Sprint> getSprintsByWorkspace(@PathVariable int workspaceId) {
        Workspaces workspace = workspaceRepository.findById(workspaceId).orElse(null); // i couldnt parse the object so i only pass th id
        if (workspace == null) {
            throw new RuntimeException("Workspace missing");
        }
        return sprintRepository.findByWorkspace(workspace);
    }

    // Retirieve all completed  sprints via workspace ID
    @GetMapping("/getCompletedSprints/{workspaceId}")
    public List<Sprint> getCompletedSprintsByWorkspace(@PathVariable int workspaceId) {
        Workspaces workspace = workspaceRepository.findById(workspaceId).orElse(null);  // i couldnt parse the object so i only pass th id
        if (workspace == null) {
            throw new RuntimeException("Workspace missing");
        }
        return sprintRepository.findCompletedByWorkspaceId(workspace.getId());
    }

    //Create a new sprint
    @PostMapping("/createSprint/{workspaceId}")
    public Sprint createNewSprint(@RequestBody Sprint sprint, @PathVariable("workspaceId") int workspaceId) {
        System.out.println("Creating new sprint");

        Workspaces makeSureWorkspaceCreated = workspaceRepository.findById(workspaceId).orElse(null); // i couldnt parse the object so i only pass th id
        oAuthUserDetails makeSureCreatedBy = userRepository.findById(sprint.getCreatedBy().getId()).orElse(null);

        // not in db
        if (makeSureWorkspaceCreated == null || makeSureCreatedBy == null) {
            throw new IllegalArgumentException("user or workspace abd !!");
        }

        sprint.setWorkspace(makeSureWorkspaceCreated);
        sprint.setCreatedBy(makeSureCreatedBy);

        return sprintRepository.save(sprint);
    }
}
