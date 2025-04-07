package com.finalyearproject.bubble.Repository.BacklogManagement;

import com.finalyearproject.bubble.Entity.BacklogManagement.Ticket;
import com.finalyearproject.bubble.Entity.Workspaces.Workspaces;
import com.finalyearproject.bubble.Entity.SprintBacklog.Sprint;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    List<Ticket> findByAssignedTo_Id(String userId);


    List<Ticket> findByCreatedBy_Id(String userId);


    List<Ticket> findByWorkspace(Workspaces workspace);

    List<Ticket> findBySprintAndWorkspace(Sprint sprint, Workspaces workspace);


    List<Ticket> findBySprint(Sprint sprint);
}
