package com.finalyearproject.bubble.Controller.BacklogManagement;

import com.finalyearproject.bubble.Entity.Authentication.oAuthUserDetails;
import com.finalyearproject.bubble.Entity.BacklogManagement.Ticket;
import com.finalyearproject.bubble.Entity.Workspaces.Workspaces;
import com.finalyearproject.bubble.Repository.BacklogManagement.TicketRepository;
import com.finalyearproject.bubble.Repository.Authentication.oAuthUserDetailsRepository;

import com.finalyearproject.bubble.Repository.Workspaces.WorkspacesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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



    // CREATE a new ticket in a workspace
    // It breaks when i pass workspace but i can pass tickets.
    // i have to validate before i create it
    @PostMapping("/create/{workspaceId}")
    public Ticket createTicket(@RequestBody Ticket ticket, @PathVariable("workspaceId") int workspaceId) {

        //again i had to check bc of mapping issues
        Workspaces workspace = workspaceRepository.findById(workspaceId).orElse(null);
        if (workspace == null) {
            throw new RuntimeException("cant get workspace /create");
        }


        if (ticket.getCreatedBy() == null || ticket.getCreatedBy().getId() == null) {
            throw new RuntimeException("cant get ticket /create");
        }

        oAuthUserDetails creator = userRepository.findById(ticket.getCreatedBy().getId()).orElse(null);
        if (creator == null) {
            throw new RuntimeException("cant get user /create");
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
                .max() // get the ticket number
                .orElse(0) + 1; // set to 0 or max+1 unique to a workspace

        ticket.setTicketNumber(nextTicketNumber); //set

        return ticketRepository.save(ticket);
    }







    // TO:DO need to make a /getAll Completed
    //Returns a list of all tickets in a worksapce
    @GetMapping("/getAll/{workspaceId}")
    public List<Ticket> getAllTickets(@PathVariable("workspaceId") int workspaceId) {
        Workspaces workspace = workspaceRepository.findById(workspaceId).orElse(null);

        if (workspace == null) {
            throw new RuntimeException("cant get workspace /getAll");
        }

        return ticketRepository.findByWorkspace(workspace);
    }






    // Add a User to a tickets assigned to
    @PutMapping("/assignTicket/{ticketId}")
    public ResponseEntity<String> assignTicket(@PathVariable Long ticketId, @RequestBody oAuthUserDetails userId) {

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("cant get ticket /assignTicket")); // ticket

        oAuthUserDetails user = userRepository.findById(userId.getId())
                .orElseThrow(() -> new RuntimeException("cant get user /assignTicket")); // user

        ticket.setAssignedTo(user); // combine
        ticketRepository.save(ticket);

        return ResponseEntity.ok("Ticket assigned /assignedTicket");
    }






    @PutMapping("/unassignTicket/{ticketId}")
    public ResponseEntity<String> unassignTicket(@PathVariable Long ticketId) {

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found")); // ticket

        ticket.setAssignedTo(null); // update value to NULL
        ticketRepository.save(ticket);


        return ResponseEntity.ok("Ticket unassigned"); //froentend needs 200 OK
    }




    // updates the status of a ticket
    // TO:DO I tried with strings but i couldnt get it working if u have time come back and make this cleaner to not send OBJ
    @PutMapping("/updateStatus/{ticketId}")
    public ResponseEntity<String> updateTicketStatus(@PathVariable Long ticketId, @RequestBody Ticket statusChangedTicket) {


        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("cant get tiket /updateStatus"));

        ticket.setStatus(statusChangedTicket.getStatus()); // SET the original tickets staus to match the updated ticket

        ticketRepository.save(ticket);

        return ResponseEntity.ok("status updated /updateStatus");
    }







    // Delete a ticket
    @DeleteMapping("/delete/{ticketId}")
    public ResponseEntity<String> deleteTicket(@PathVariable Long ticketId) {


        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("cant find ticket /delete"));

        ticketRepository.delete(ticket); // deleet ticket OBJ

        return ResponseEntity.ok("deleted /delete");
    }





}