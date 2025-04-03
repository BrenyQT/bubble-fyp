package com.finalyearproject.bubble.Repository.SprintBacklog;

import com.finalyearproject.bubble.Entity.SprintBacklog.Sprint;
import com.finalyearproject.bubble.Entity.Workspaces.Workspaces;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SprintRepository extends JpaRepository<Sprint, Integer> {

    // Find all sprints for a workspace
    List<Sprint> findByWorkspace(Workspaces workspace);

    // Find completed sprints by workspace id
    //Update this to maybe take object
    List<Sprint> findCompletedByWorkspaceId(int id);

    // Find the current active sprint for a workspace
    Sprint findByWorkspaceAndCurrent(Workspaces workspace, boolean current);
}
