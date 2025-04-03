package com.finalyearproject.bubble.Repository.WorkspaceDashboard;

import com.finalyearproject.bubble.Entity.WorkspaceDashboard.TodoTask;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TodoTaskRepository extends JpaRepository<TodoTask, Long> {

    // Find tasks by userId (String) and workspaceId (int)
    List<TodoTask> findByUserIdAndWorkspaceId(String userId, int workspaceId);
}
