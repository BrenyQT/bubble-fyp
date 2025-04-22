package com.finalyearproject.bubble.Controller.Messaging;

import com.finalyearproject.bubble.Entity.WorkspaceChat.Message;
import com.finalyearproject.bubble.Objects.WorkspaceChat.MessageDTO;
import com.finalyearproject.bubble.Repository.WorkspaceChat.MessageRepository;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors; // https://stackoverflow.com/questions/21912314/what-kind-of-liste-does-collectors-tolist-return

@RestController
@CrossOrigin
@RequestMapping("/messages")
public class MessageController {

    private final MessageRepository messageRepository;

    public MessageController(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }
    // Returns 200 with a list of messages for a particular workspace using its ID


    @GetMapping
    public List<MessageDTO> getMessagesByWorkspace(@RequestParam("workspaceId") int workspaceId) {
        List<Message> messages = messageRepository.findMessagesByWorkspaceId(workspaceId);
        // i have to map this tp a dto because loading it straigh from db causes buffer (refresh needed)
        return messages.stream().map(message -> {
            MessageDTO dto = new MessageDTO();
            dto.setId(message.getId());
            dto.setSenderId(message.getSender().getId());
            dto.setSenderName(message.getSender().getName());
            dto.setSenderEmail(message.getSender().getEmail());
            dto.setSenderPicture(message.getSender().getPicture());
            dto.setContent(message.getContent());
            dto.setTimestamp(message.getTimestamp());
            dto.setWorkspaceId(message.getWorkspace().getId());
            return dto;
        }).collect(Collectors.toList()); // TO:DO i tried making this into a dto and passing but it got stuck maybe come back and figure data transaction error
    } // returns a list of messages
}
