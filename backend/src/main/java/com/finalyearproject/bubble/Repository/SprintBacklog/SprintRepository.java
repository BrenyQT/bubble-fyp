package com.finalyearproject.bubble.Repository.SprintBacklog;

import com.finalyearproject.bubble.Entity.SprintBacklog.Sprint;
import com.finalyearproject.bubble.Entity.Workspaces.Workspaces;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SprintRepository extends JpaRepository<Sprint, Integer> {

    // Find all sprints for a workspace
    List<Sprint> findByWorkspace(Workspaces workspace);

    //Find sprints list from workpsace Id
    List<Sprint> findByWorkspace_Id(int workspace);

    // Find completed sprints by workspace id
    //Update this to maybe take object
    List<Sprint> findCompletedByWorkspaceId(int id);

    // Find the current active sprint for a workspace
    Sprint findByWorkspaceAndCurrent(Workspaces workspace, boolean current);

    // TO:DO - this is kinda bad lol fix this
    // get a sprint using workspace.id and ticket.id
    @Query("SELECT sprint FROM Sprint sprint JOIN sprint.tickets ticket WHERE sprint.workspace.id = :workspaceId AND ticket.id = :ticketId")
    Sprint findByWorkspaceAndTicket(@Param("workspaceId") int workspaceId, @Param("ticketId") Long ticketId);
}
