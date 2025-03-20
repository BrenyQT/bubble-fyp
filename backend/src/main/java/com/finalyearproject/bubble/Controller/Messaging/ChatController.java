package com.finalyearproject.bubble.Controller.Messaging;

import com.finalyearproject.bubble.Entity.WorkspaceChat.Message;
import com.finalyearproject.bubble.Repository.WorkspaceChat.MessageRepository;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Date;

@Controller
public class ChatController {
    private final SimpMessagingTemplate messagingTemplate;
    private final MessageRepository messageRepository;


    public ChatController(SimpMessagingTemplate messagingTemplate, MessageRepository messageRepository) {
        this.messagingTemplate = messagingTemplate;
        this.messageRepository = messageRepository;
    }

    /**
     Server is listening for a message due to websocket connection

     The Server receives the message from the frontend.
     The server then broadcasts the message to all user subscribes to /topic/{workspaceId}

     */
    @MessageMapping("/sendMessage")
    public void sendMessage(Message message) {
        message.setTimestamp(new Date());
        messageRepository.save(message);

        String destination = "/topic/" + message.getWorkspace().getId(); // conncat to set send to correct workspace
        messagingTemplate.convertAndSend(destination, message);
    }
}
