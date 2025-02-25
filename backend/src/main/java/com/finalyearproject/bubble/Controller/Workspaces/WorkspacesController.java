package com.finalyearproject.bubble.Controller.Workspaces;

import com.finalyearproject.bubble.Services.Workspaces.WorkspaceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
public class WorkspacesController {

    private final WorkspaceService workspaceService;

    public WorkspacesController(WorkspaceService workspaceService) {
        this.workspaceService = workspaceService;
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
            e.printStackTrace();
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
}
