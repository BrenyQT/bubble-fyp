package com.finalyearproject.bubble.Repository.WorkspaceChat;

import com.finalyearproject.bubble.Entity.WorkspaceChat.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

import com.finalyearproject.bubble.Entity.WorkspaceChat.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Integer> {
    // Correct way to query by workspace ID inside the Workspaces entity
    @Query("SELECT m FROM Message m JOIN FETCH m.sender JOIN FETCH m.workspace WHERE m.workspace.id = :workspaceId")
    List<Message> findByWorkspace_Id(@Param("workspaceId") int workspaceId);
}


