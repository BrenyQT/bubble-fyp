package com.finalyearproject.bubble.Controller.Workspaces;

import com.finalyearproject.bubble.Entity.Authentication.oAuthUserDetails;
import com.finalyearproject.bubble.Repository.Authentication.oAuthUserDetailsRepository;
import com.finalyearproject.bubble.Services.Workspaces.WorkspaceService;
import com.finalyearproject.bubble.Entity.WorkspaceDashboard.Announcement;
import com.finalyearproject.bubble.Entity.Workspaces.Workspaces;
import com.finalyearproject.bubble.Repository.Workspaces.WorkspacesRepository;
import com.finalyearproject.bubble.Repository.WorkspaceDashboard.AnnouncementRepository;



import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
public class WorkspacesController {

    private final WorkspaceService workspaceService;
    private final WorkspacesRepository workspacesRepository;
    private final AnnouncementRepository announcementRepository;
    private final oAuthUserDetailsRepository oAuthUserDetailsRepository;

    public WorkspacesController(WorkspaceService workspaceService, WorkspacesRepository workspacesRepository, AnnouncementRepository announcementRepository, oAuthUserDetailsRepository oAuthUserDetailsRepository) {
        this.workspaceService = workspaceService;
        this.workspacesRepository = workspacesRepository;
        this.announcementRepository = announcementRepository;
        this.oAuthUserDetailsRepository = oAuthUserDetailsRepository;
    }

    /*
    Sends a POST Request to /newGroup

    Expects a JSON payload in the request body
    If data inputted is good 200 : ok

    404 : Not Found (Missing data in request)
    500 : couldnt hit endpoint
    */
    @PostMapping("/newGroup")
    public ResponseEntity<?> createWorkspace(@RequestBody Map<String, Object> requestData) {
        try {
            String workspaceCode = workspaceService.createWorkspace(requestData);
            return ResponseEntity.ok("Workspace created successfully with code: " + workspaceCode);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal Server Error");
        }
    }

    /*
    Sends a GET Request to /getWorkspaces

    Expects a user email in url as param

    Returns a map id object of a workspaces of a user
    200 : OK

    404 : Not Found : the function failed

    500 : Internal Server error
        */
    @GetMapping("/getWorkspaces")
    public ResponseEntity<?> getUserWorkspaces(@RequestParam String email) {
        try {
            List<Map<String, Object>> workspaces = workspaceService.getUserWorkspaces(email);
            return ResponseEntity.ok(workspaces);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Internal Server Error !!");
        }
    }

    /*
    Sends a POST Request to /joinWorkspace

    Expects a JSON object (6 Digit code).

    Attempts to join workspace
    200 : OK
    404 : Not Found Function fails
    400 :Bad Request : Not allowed in current state ?? Edge case could be spam joining  ??
    500 : Internal Server error
     */
    @PostMapping("/joinWorkspace")
    public ResponseEntity<?> joinWorkspace(@RequestBody Map<String, String> requestData) {
        try {
            String message = workspaceService.joinWorkspace(requestData);
            return ResponseEntity.ok(message);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Internal Server Error");
        }
    }

    /*
    Sends a POST Request to /leaveWorkspace

    Expects a JSON payload with workspaceId and userId

    200 : OK
    404 : Not Found (Workspace/User not found)
    500 : Internal Server error
     */
    @PostMapping("/leaveWorkspace")
    public ResponseEntity<?> leaveWorkspace(@RequestBody Map<String, String> requestData) {
        try {
            String workspaceId = requestData.get("workspaceId");
            String userId = requestData.get("userId");
            boolean isLastMember = workspaceService.leaveWorkspace(workspaceId, userId);

            if (isLastMember) {
                // If the current user is the last member, delete the workspace
                workspaceService.deleteWorkspace(workspaceId);
                return ResponseEntity.ok("Workspace deleted because you were the last member.");
            } else {
                return ResponseEntity.ok("Successfully left the workspace.");
            }
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Internal Server Error");
        }
    }

    //Delete a wokspace from the wrokspace Id
    @DeleteMapping("/deleteWorkspace/{workspaceId}")
    public ResponseEntity<?> deleteWorkspace(@PathVariable String workspaceId) {
        try {
            workspaceService.deleteWorkspace(workspaceId);
            return ResponseEntity.ok("deleted the workspace");
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("500 cant get server");
        }
    }

    @GetMapping("getAnnouncements/{workspaceId}")
    public List<Announcement> getAnnouncements(@PathVariable int workspaceId) {


        Workspaces workspace = workspacesRepository.findById(workspaceId)
                .orElseThrow(() -> new NoSuchElementException("Workspace not found"));

        return announcementRepository.findByWorkspace(workspace);
    }


    @PostMapping("/addAnnouncements")
    public ResponseEntity<Announcement> addAnnouncement(@RequestBody Map<String, Object> requestData) {
        try {
            //passing the announcement wasnt parsing so i had to pass as strings to avoid use of DTO

            String content = (String) requestData.get("content");
            String authorId = (String) requestData.get("authorId");
            int workspaceId = (int) requestData.get("workspaceId");

            Workspaces workspace = workspacesRepository.findById(workspaceId)
                    .orElseThrow(() -> new NoSuchElementException("cant get a workspace /addAnnouncements"));

            oAuthUserDetails author = oAuthUserDetailsRepository.findById(authorId)
                    .orElseThrow(() -> new NoSuchElementException("cant get user /addAnnouncements"));

            Announcement announcement = new Announcement();
            announcement.setContent(content);
            announcement.setWorkspace(workspace);
            announcement.setAuthor(author);
            announcement.setCreatedAt(new Date());

            Announcement saved = announcementRepository.save(announcement);

            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }


}
