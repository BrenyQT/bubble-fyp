package com.finalyearproject.bubble.Controller.Messaging;

import com.finalyearproject.bubble.Entity.WorkspaceChat.Message;
import com.finalyearproject.bubble.Repository.WorkspaceChat.MessageRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/messages")
public class MessageController {
    private final MessageRepository messageRepository;



    public MessageController(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }
    
    @RestController
    @RequestMapping("/messages")
    public class messageController {

        // Returns 200 with a list of messages for a particular workspace using its ID
        @GetMapping
        @Transactional // get all messages if something fails start loading from beginning again
        public ResponseEntity<?> getMessages(@RequestParam(required = false) Integer workspaceId) {
            if (workspaceId == null) {
                return ResponseEntity.badRequest().body("workspaceId is required");
            }

            List<Message> messages = messageRepository.findByWorkspace_Id(workspaceId);
            return ResponseEntity.ok(messages);
        }
    }


}
