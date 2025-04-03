package com.finalyearproject.bubble.Repository.WorkspaceChat;

import com.finalyearproject.bubble.Entity.WorkspaceChat.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Integer> {

    @Query("SELECT m FROM Message m JOIN FETCH m.sender JOIN FETCH m.workspace WHERE m.workspace.id = :workspaceId")
    List<Message> findMessagesByWorkspaceId(@Param("workspaceId") int workspaceId);
}
