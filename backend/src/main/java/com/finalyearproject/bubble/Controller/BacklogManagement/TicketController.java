package com.finalyearproject.bubble.Controller.BacklogManagement;

import com.finalyearproject.bubble.Entity.Authentication.oAuthUserDetails;
import com.finalyearproject.bubble.Entity.BacklogManagement.Ticket;
import com.finalyearproject.bubble.Entity.Workspaces.Workspaces;
import com.finalyearproject.bubble.Repository.BacklogManagement.TicketRepository;
import com.finalyearproject.bubble.Repository.Authentication.oAuthUserDetailsRepository;

import com.finalyearproject.bubble.Repository.Workspaces.WorkspacesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/tickets")
public class TicketController {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private oAuthUserDetailsRepository userRepository;

    @Autowired
    private WorkspacesRepository workspaceRepository;

    // CREATE a new ticket
    // It breaks when i pass workspace but i can pass tickets.
    // i have to validate before i create it
    @PostMapping("/create/{workspaceId}")
    public Ticket createTicket(@RequestBody Ticket ticket, @PathVariable("workspaceId") int workspaceId) {

        Workspaces workspace = workspaceRepository.findById(workspaceId).orElse(null);
        if (workspace == null) {
            throw new RuntimeException("Invalid workspace or workspace not found");
        }


        if (ticket.getCreatedBy() == null || ticket.getCreatedBy().getId() == null) {
            throw new RuntimeException("no person attached ");
        }

        oAuthUserDetails creator = userRepository.findById(ticket.getCreatedBy().getId()).orElse(null);
        if (creator == null) {
            throw new RuntimeException("no person attached ");
        }

        // add db attributes
        ticket.setCreatedBy(creator);
        ticket.setWorkspace(workspace);
        ticket.setCreatedAt(new Date());
        ticket.setStatus("Backlog");

        // Generate ticket number
        int nextTicketNumber = ticketRepository.findByWorkspace(workspace)
                .stream()
                .mapToInt(Ticket::getTicketNumber)
                .max()
                .orElse(0) + 1;

        ticket.setTicketNumber(nextTicketNumber);

        return ticketRepository.save(ticket);
    }


    // return a list of tickets to frontend
    @GetMapping("/getAll/{workspaceId}")
    public List<Ticket> getAllTickets(@PathVariable("workspaceId") int workspaceId) {
        Workspaces workspace = workspaceRepository.findById(workspaceId).orElse(null);
        if (workspace == null) {
            throw new RuntimeException("Workspace not found");
        }
        return ticketRepository.findByWorkspace(workspace);
    }
}
