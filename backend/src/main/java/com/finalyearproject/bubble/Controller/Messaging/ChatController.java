package com.finalyearproject.bubble.Controller.Messaging;

import com.finalyearproject.bubble.Entity.WorkspaceChat.Message;
import com.finalyearproject.bubble.Entity.Authentication.oAuthUserDetails;
import com.finalyearproject.bubble.Entity.Workspaces.Workspaces;
import com.finalyearproject.bubble.Objects.WorkspaceChat.MessageDTO;
import com.finalyearproject.bubble.Repository.Authentication.oAuthUserDetailsRepository;
// dirty fix ...............

import com.finalyearproject.bubble.Repository.Workspaces.WorkspacesRepository;
import com.finalyearproject.bubble.Repository.WorkspaceChat.MessageRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.Date;

@Controller
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final MessageRepository messageRepository;
    // dirty fix ...............
    private final oAuthUserDetailsRepository userRepository;
    private final WorkspacesRepository workspaceRepository;

    @Autowired
    public ChatController(SimpMessagingTemplate messagingTemplate,
                          MessageRepository messageRepository,
                          // dirty fix ...............

                          oAuthUserDetailsRepository userRepository,
                          WorkspacesRepository workspaceRepository) {
        this.messagingTemplate = messagingTemplate;
        this.messageRepository = messageRepository;
        // dirty fix ...............

        this.userRepository = userRepository;
        this.workspaceRepository = workspaceRepository;
    }
    /**
     Server is listening for a message due to websocket connection

     The Server receives the message from the frontend.
     The server then broadcasts the message to all user subscribes to /topic/{workspaceId}

     */

    @MessageMapping("/sendMessage")
    public void sendMessage(Message message) {
        // TO:DO: fix for this is kinda dirty but i can look into if time left
        oAuthUserDetails makeSureIGetFullSender = userRepository.findById(message.getSender().getId()).orElse(null);
        Workspaces makeSureIGetWorkspace = workspaceRepository.findById(message.getWorkspace().getId()).orElse(null);

        if (makeSureIGetFullSender == null || makeSureIGetWorkspace == null) {
            System.out.println("Invalid sender or workspace ID");
            return;
        }

        // have to set it here to avoid JSON parsing issue??
        // PROBLEM: my problem occured when workspace object go too large ?? check this before submission
        message.setSender(makeSureIGetFullSender);
        message.setWorkspace(makeSureIGetWorkspace);
        message.setTimestamp(new Date());

        // i can now save it in the db
        Message saved = messageRepository.save(message);

        // create a DTO to send back to frontend
        // TO:TO maybe find a better way to parse and send the entity also look into best practices
        MessageDTO dto = new MessageDTO();
        dto.setId(saved.getId());
        dto.setSenderId(makeSureIGetFullSender.getId());
        dto.setSenderName(makeSureIGetFullSender.getName());
        dto.setSenderEmail(makeSureIGetFullSender.getEmail());
        dto.setSenderPicture(makeSureIGetFullSender.getPicture());
        dto.setContent(saved.getContent());
        dto.setTimestamp(saved.getTimestamp());
        dto.setWorkspaceId(makeSureIGetWorkspace.getId());

        // Broadcast the dto to topic so every subscriber gets the message
        messagingTemplate.convertAndSend("/topic/" + makeSureIGetWorkspace.getId(), dto);
    }
}
