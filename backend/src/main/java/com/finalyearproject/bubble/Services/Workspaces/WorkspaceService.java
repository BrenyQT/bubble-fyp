package com.finalyearproject.bubble.Services.Workspaces;

import com.finalyearproject.bubble.Entity.Authentication.oAuthUserDetails;
import com.finalyearproject.bubble.Entity.BacklogManagement.Ticket;
import com.finalyearproject.bubble.Entity.GanttChart.GanttTask;
import com.finalyearproject.bubble.Entity.SprintBacklog.Sprint;
import com.finalyearproject.bubble.Entity.WorkspaceChat.Message;
import com.finalyearproject.bubble.Entity.WorkspaceDashboard.Announcement;
import com.finalyearproject.bubble.Entity.WorkspaceDashboard.TodoTask;
import com.finalyearproject.bubble.Entity.Workspaces.Workspaces;
import com.finalyearproject.bubble.Repository.Authentication.oAuthUserDetailsRepository;
import com.finalyearproject.bubble.Repository.BacklogManagement.TicketRepository;
import com.finalyearproject.bubble.Repository.GanttTaskRepository;
import com.finalyearproject.bubble.Repository.SprintBacklog.SprintRepository;
import com.finalyearproject.bubble.Repository.WorkspaceChat.MessageRepository;
import com.finalyearproject.bubble.Repository.WorkspaceDashboard.AnnouncementRepository;
import com.finalyearproject.bubble.Repository.WorkspaceDashboard.TodoTaskRepository;
import com.finalyearproject.bubble.Repository.Workspaces.WorkspacesRepository;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.*;

@Service
public class WorkspaceService {

    private final WorkspacesRepository workspacesRepository;
    private final oAuthUserDetailsRepository userRepository;
    private final MessageRepository messageRepository;
    private final TodoTaskRepository todoTaskRepository;
    private final TicketRepository ticketRepository;
    private final SprintRepository sprintRepository;
    private final AnnouncementRepository announcementRepository;
    private final GanttTaskRepository ganttTaskRepository;

    // Characters which code can be
    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    // Random Character
    private static final SecureRandom RANDOM = new SecureRandom();

    public WorkspaceService(WorkspacesRepository workspacesRepository, oAuthUserDetailsRepository userRepository, MessageRepository messageRepository, TodoTaskRepository todoTaskRepository, TicketRepository ticketRepository, SprintRepository sprintRepository, AnnouncementRepository announcementRepository, GanttTaskRepository ganttTaskRepository  ) {
        this.workspacesRepository = workspacesRepository;
        this.userRepository = userRepository;
        this.messageRepository =    messageRepository;
        this.todoTaskRepository = todoTaskRepository;
        this.ticketRepository = ticketRepository;
        this.sprintRepository = sprintRepository;
        this.announcementRepository = announcementRepository;
        this.ganttTaskRepository = ganttTaskRepository;
    }

    // Generates code by appending random characters
    private String generateWorkspaceCode() {
        StringBuilder code = new StringBuilder(6);
        for (int i = 0; i < 6; i++) {
            code.append(CHARACTERS.charAt(RANDOM.nextInt(CHARACTERS.length())));
        }
        return code.toString();
    }

    /*
    Create a new workspace

    Extract data from body for workspace
    get user email
    */
    public String createWorkspace(Map<String, Object> requestData) {

        String name = (String) requestData.get("name");
        String bio = (String) requestData.get("bio");
        String base64Image = (String) requestData.get("image");

        String email = (String) requestData.get("email");
        // Validate user
        Optional<oAuthUserDetails> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            throw new NoSuchElementException("User not found ??");
        }
        oAuthUserDetails user = userOptional.get();

        // Generate code
        String workspaceCode = generateWorkspaceCode();

        // Create and save the new workspace with a list of the creator
        Workspaces newWorkspace = new Workspaces(0, base64Image, name, bio, List.of(user), workspaceCode);
        workspacesRepository.save(newWorkspace);

        return workspaceCode;
    }

    /*
    Loads a users workspaces.

    Returns a list of Workspaces.
    */
    public List<Map<String, Object>> getUserWorkspaces(String email) {
        Optional<oAuthUserDetails> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            throw new NoSuchElementException("User not found ??");
        }
        oAuthUserDetails user = userOptional.get();

        List<Workspaces> userWorkspaces = workspacesRepository.findByUsersContaining(user);
        List<Map<String, Object>> response = new ArrayList<>();

        for (Workspaces workspace : userWorkspaces) {
            Map<String, Object> workspaceData = new HashMap<>();
            workspaceData.put("id", workspace.getId());
            workspaceData.put("name", workspace.getName());
            workspaceData.put("bio", workspace.getBio());
            workspaceData.put("users", workspace.getUsers());
            workspaceData.put("code", workspace.getCode());
            workspaceData.put("image", workspace.getImage() != null ? workspace.getImage() : null);
            response.add(workspaceData);
        }
        return response;
    }

    /*
    Allows a user to join a workspace via valid code
    */
    public String joinWorkspace(Map<String, String> requestData) {
        String email = requestData.get("email");
        String workspaceCode = requestData.get("code");

        // Checks if user is found in database
        Optional<oAuthUserDetails> userDb = userRepository.findByEmail(email);
        if (userDb.isEmpty()) {
            throw new NoSuchElementException("User not found ??");
        }
        oAuthUserDetails user = userDb.get();

        // Checks if workspace with code found in database
        Optional<Workspaces> workspaceOptional = workspacesRepository.findByCode(workspaceCode);
        if (workspaceOptional.isEmpty()) {
            throw new NoSuchElementException("Workspace not found ?? ");
        }
        Workspaces workspace = workspaceOptional.get();

        // Check if the user is already part of the workspace
        if (workspace.getUsers().contains(user)) {
            throw new IllegalStateException("User already in workspace !!");
        }

        // Add the user to the workspace and save the update
        workspace.addUser(user);
        workspacesRepository.save(workspace);

        return "User added to workspace successfully !!!!!!!!!!!";
    }

    /*
    Allows a user to leave the workspace

    Checks if the user is the last member, if so deletes the workspace
    */
    public boolean leaveWorkspace(String workspaceId, String userId) throws Exception {
        // Fix this its so messy
        // fix this is coulnt find the workspace need safety net to ensure i have all i need
        Optional<Workspaces> workspaceOptional = workspacesRepository.findById(Integer.parseInt(workspaceId));
        if (workspaceOptional.isEmpty()) {
            throw new NoSuchElementException("cant find the workspace ");
        }

        Workspaces workspace = workspaceOptional.get();
        Optional<oAuthUserDetails> userOptional = userRepository.findById((userId));

        if (userOptional.isEmpty()) {
            throw new Exception("User not found");
        }

        oAuthUserDetails user = userOptional.get();
        if (!workspace.getUsers().contains(user)) {
            throw new IllegalStateException("User is not a member of this workspace");
        }

        workspace.removeUser(user); // remove me

        if (workspace.getUsers().isEmpty()) {
            workspacesRepository.delete(workspace); // deletes if only memeber
            return true;
        }

        workspacesRepository.save(workspace);
        return false;
    }

/*
Deletes a workspace and all associated:
messages
to do tasks
sprints
tickets
announcements

*/
    public void deleteWorkspace(String workspaceId) {
        Optional<Workspaces> workspaceOptional = workspacesRepository.findById(Integer.parseInt(workspaceId));
        if (workspaceOptional.isEmpty()) {
            throw new NoSuchElementException("cant find workspace ");
        }

        Workspaces workspace = workspaceOptional.get();
        int wid = workspace.getId();

        List<Message> messages = messageRepository.findMessagesByWorkspaceId(wid);
        messageRepository.deleteAll(messages);

        List<TodoTask> todos = todoTaskRepository.findByWorkspaceId(wid);
        todoTaskRepository.deleteAll(todos);

        List<Sprint> response = sprintRepository.findByWorkspace_Id(wid);
        sprintRepository.deleteAll(response);

        List<Ticket> back = ticketRepository.findByWorkspace_Id(wid);
        ticketRepository.deleteAll(back);

        List<Announcement> announcements = announcementRepository.findByWorkspace(workspace);
        announcementRepository.deleteAll(announcements);

        List<GanttTask> ganttTasks = ganttTaskRepository.findByWorkspace(workspace);
        ganttTaskRepository.deleteAll(ganttTasks);

        workspacesRepository.delete(workspace);
    }


}
