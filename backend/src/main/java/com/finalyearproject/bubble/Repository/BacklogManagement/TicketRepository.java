package com.finalyearproject.bubble.Repository.BacklogManagement;

import com.finalyearproject.bubble.Entity.BacklogManagement.Ticket;
import com.finalyearproject.bubble.Entity.Workspaces.Workspaces;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    List<Ticket> findByAssignedTo_Id(String userId);


    List<Ticket> findByCreatedBy_Id(String userId);


    List<Ticket> findByWorkspace(Workspaces workspace);
}
