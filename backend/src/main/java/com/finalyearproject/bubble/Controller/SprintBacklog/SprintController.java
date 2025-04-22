package com.finalyearproject.bubble.Controller.SprintBacklog;

import com.finalyearproject.bubble.Entity.Authentication.oAuthUserDetails;
import com.finalyearproject.bubble.Entity.BacklogManagement.Ticket;
import com.finalyearproject.bubble.Entity.SprintBacklog.Sprint;
import com.finalyearproject.bubble.Entity.Workspaces.Workspaces;
import com.finalyearproject.bubble.Repository.Authentication.oAuthUserDetailsRepository;
import com.finalyearproject.bubble.Repository.BacklogManagement.TicketRepository;
import com.finalyearproject.bubble.Repository.SprintBacklog.SprintRepository;
import com.finalyearproject.bubble.Repository.Workspaces.WorkspacesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

// TO:DO this is messy tidy it up

@RestController
@RequestMapping("/sprints")
public class SprintController {

    private final SprintRepository sprintRepository;
    private final oAuthUserDetailsRepository userRepository;
    private final WorkspacesRepository workspaceRepository;
    private final TicketRepository ticketRepository;

    @Autowired
    public SprintController(SprintRepository sprintRepository,
                            oAuthUserDetailsRepository userRepository,
                            WorkspacesRepository workspaceRepository,
                            TicketRepository ticketRepository) {
        this.sprintRepository = sprintRepository;
        this.userRepository = userRepository;
        this.workspaceRepository = workspaceRepository;
        this.ticketRepository = ticketRepository;
    }

    // Returns all sprints via workspace ID
    @GetMapping("/getSprints/{workspaceId}")
    public List<Sprint> getSprintsByWorkspace(@PathVariable int workspaceId) {
        Workspaces workspace = workspaceRepository.findById(workspaceId).orElse(null); // i couldnt parse the object so i only pass th id
        if (workspace == null) {
            throw new RuntimeException("Workspace missing");
        }
        return sprintRepository.findByWorkspace(workspace);
    }







    // Returns all Sprints where Completed = True
    @GetMapping("/getCompletedSprints/{workspaceId}")
    public List<Sprint> getCompletedSprintsByWorkspace(@PathVariable int workspaceId) {
        Workspaces workspace = workspaceRepository.findById(workspaceId).orElse(null);
        if (workspace == null) {
            throw new RuntimeException("Workspace missing");
        }
        return sprintRepository.findCompletedByWorkspaceId(workspace.getId());
    }






    //Create a new sprint for a specific workspace
    // Note:  i had to do all the checks because it was freaking outwith mapping req
    @PostMapping("/createSprint/{workspaceId}")
    public Sprint createNewSprint(@RequestBody Sprint sprint, @PathVariable("workspaceId") int workspaceId) {
        System.out.println("Creating new sprint");

        // make sure workspace exists
        Workspaces workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new IllegalArgumentException("cant get workspace for /createSprint "));

        // Ensure user exists
        oAuthUserDetails createdBy = userRepository.findById(sprint.getCreatedBy().getId())
                .orElseThrow(() -> new IllegalArgumentException("cant get user for /createSprint "));

        // Get the next ticket number in this workspace
        int nextTicketNumber = sprintRepository.findByWorkspace(workspace)
                .stream()
                .mapToInt(Sprint::getSprintNumber)
                .max() // finding the largest id
                .orElse(0) + 1; // add one onto it

        // store retreive data of new sprint
        sprint.setWorkspace(workspace);
        sprint.setCreatedBy(createdBy);
        sprint.setSprintNumber(nextTicketNumber);  // set it

        return sprintRepository.save(sprint);
    }




    // add a ticket to a sprint
    @PostMapping("/addTickets/{sprintId}")
    public ResponseEntity<String> addTicketsToSprint(@PathVariable int sprintId, @RequestBody List<Long> ticketIds) {

        //again i had to check bc of mapping issues
        Sprint sprint = sprintRepository.findById(sprintId)
                .orElseThrow(() -> new RuntimeException("cant get the sprint for /addTickets "));
        //again i had to check bc of mapping issues
        List<Ticket> tickets = ticketRepository.findAllById(ticketIds);
        // set the sprint in each ticket
        // so if i delete a sprint it remove it from ticket
        // and if i delete a ticket i dont need to worry about removing it from the sprint aswell
        for (Ticket ticket : tickets) {
            ticket.setSprint(sprint);
        }

        ticketRepository.saveAll(tickets); // save it

        return ResponseEntity.ok("cant get the ticket for /addTickets");
    }




    // get a particular Sprints tickets
    @PostMapping("/getTicketsBySprint")
    public ResponseEntity<List<Ticket>> getTicketsBySprintAndWorkspace(@RequestBody Map<String, Integer> request) {

        int sprintId = request.get("sprintId"); // get sprintId from the req body
        int workspaceId = request.get("workspaceId"); // get worksapceId from the req body

        //again i had to check bc of mapping issues
        Sprint sprint = sprintRepository.findById(sprintId)
                .orElseThrow(() -> new RuntimeException("cant get sprint for /getTicketsBySprint "));
        //again i had to check bc of mapping issues
        Workspaces workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new RuntimeException("cant get workspace for /getTicketsBySprint "));

        List<Ticket> tickets = ticketRepository.findBySprintAndWorkspace(sprint, workspace); // populate the list of tickets to send back
        return ResponseEntity.ok(tickets);
    }





    // remove a list of tickets from a sprint
    @PostMapping("/removeTickets")
    public ResponseEntity<String> removeMultipleTickets(@RequestBody List<Long> ticketIds) {
        List<Ticket> tickets = ticketRepository.findAllById(ticketIds);
        for (Ticket ticket : tickets) {
            ticket.setSprint(null); //update each ticket OBJ in db
        }
        ticketRepository.saveAll(tickets);
        return ResponseEntity.ok("Removed selected tickets from sprint");
    }



    // Returns a list of tickets within Sprint uw=sing workpsace.id
    @GetMapping("/getCurrentSprintTickets/{workspaceId}")
    public ResponseEntity<List<Ticket>> getCurrentSprintTickets(@PathVariable int workspaceId) {
        //again i had to check bc of mapping issues
        Workspaces workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new RuntimeException("Workspace not found"));

        // TO:DO this is a dirty way of doing this
        // i should create a custom query instaed of returening all and filtering before returning to frontend
        Sprint currentSprint = sprintRepository.findByWorkspace(workspace).stream()
                .filter(Sprint::isCurrent)
                .findFirst()
                .orElse(null);


        if (currentSprint == null) {
            return ResponseEntity.ok(List.of()); // no sprint set as current i need to return this bc my ticket repo freaks out sending an empty list
        }

        List<Ticket> tickets = ticketRepository.findBySprintAndWorkspace(currentSprint, workspace);
        return ResponseEntity.ok(tickets);
    }







    // Set the sprint id as the current within a workpspace
    @PutMapping("/setCurrent")
    public ResponseEntity<String> setCurrentSprint(@RequestBody Map<String, Integer> request) {

        int sprintId = request.get("sprintId");

        int workspaceId = request.get("workspaceId");

        Workspaces workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new RuntimeException(" cannot /setCurrent "));

        //again i had to check bc of mapping issues
        List<Sprint> sprints = sprintRepository.findByWorkspace(workspace);

        for (Sprint sprint : sprints) {
            sprint.setCurrent(sprint.getId() == sprintId); // set the current sprint when i find the id that matches the passed in id
        }

        sprintRepository.saveAll(sprints);
        return ResponseEntity.ok(" updated the current sprint ");
    }








    // Deletes a Sprint from a workspace
    @DeleteMapping("/delete/{workspaceId}")
    public ResponseEntity<String> deleteSprint(@PathVariable int workspaceId, @RequestBody Map<String, Integer> payload) {

        int sprintId = payload.get("sprintId");


        Workspaces workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new RuntimeException("cant get workspace for /delete "));

        Sprint sprintThatIsBeingDeleted = sprintRepository.findById(sprintId)
                .orElseThrow(() -> new RuntimeException("cant get sprint / delete "));

        if (sprintThatIsBeingDeleted.getWorkspace().getId() != workspace.getId()) {
            return ResponseEntity.status(403).body("safety net / delete");
        }

        List<Ticket> deletedSprintTickets = ticketRepository.findBySprint(sprintThatIsBeingDeleted);
        //update all tickets to not have a sprint
        for (Ticket ticket : deletedSprintTickets ) {
            ticket.setSprint(null);
        }
        ticketRepository.saveAll(deletedSprintTickets);

        sprintRepository.delete(sprintThatIsBeingDeleted); // delete the sprint
        return ResponseEntity.ok("deleted /delete sprint"); // 200 to tell frontend ok

    }








    // mark a sprrint as completed so it wont show up in sprint backlog
    @PutMapping("/markSprintAsCompleted/{sprintId}")
    public ResponseEntity<String> markSprintAndTicketsAsCompleted(@PathVariable int sprintId) {
        Sprint sprint = sprintRepository.findById(sprintId)
                .orElseThrow(() -> new RuntimeException("check check /markSprintAsCompleted "));

        sprint.setCurrent(false); // i can do this bc the only way to completed a sprint is if its marked as current
        sprint.setCompleted(true); // mark as completed
        sprintRepository.save(sprint);


        // gotta update all the tickets in the sprint so they arent shown in backlog
        List<Ticket> tickets = ticketRepository.findBySprint(sprint);

        for (Ticket ticket : tickets) {
            ticket.setCompleted(true); // yurdddd
            ticketRepository.save(ticket);
        }

        return ResponseEntity.ok("completed /markSprintAsCompleted");
    }







    // get the sprint id from ticket id
    // if u see this u dont
    // this should not be like this but it is
    @GetMapping("/getSprintByTicket/{ticketId}")
    public ResponseEntity<Sprint> getSprintByTicket(@PathVariable Long ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("cant get ticket for /getSprintByTicket "));

        Sprint sprint = ticket.getSprint(); // get the sprint id from ticket for my completed sprints button

        if (sprint == null) {
            return ResponseEntity.status(404).body(null);
        }

        return ResponseEntity.ok(sprint);
    }



}
