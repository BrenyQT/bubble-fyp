package com.finalyearproject.bubble.Controller.WorkspaceDashboard;

import com.finalyearproject.bubble.Entity.WorkspaceDashboard.TodoTask;
import com.finalyearproject.bubble.Repository.WorkspaceDashboard.TodoTaskRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/todo")
public class TodoTaskController {

    private final TodoTaskRepository todoTaskRepository;

    public TodoTaskController(TodoTaskRepository todoTaskRepository) {
        this.todoTaskRepository = todoTaskRepository;
    }

    // returns all the tasks for a user in a particular workspace
    @GetMapping("/{userId}/{workspaceId}")
    public List<TodoTask> getUserWorkspaceTasks(@PathVariable String userId, @PathVariable int workspaceId) {
        return todoTaskRepository.findByUserIdAndWorkspaceId(userId, workspaceId);
    }

    // add the tesk (ID of workspace is in ticket)
    @PostMapping("/add")
    public TodoTask addTask(@RequestBody TodoTask task) {
        return todoTaskRepository.save(task);
    }

    // Update task completion status
    @PutMapping("/update/{taskId}")
    public TodoTask updateTask(@PathVariable Long taskId, @RequestBody TodoTask updatedTask) {
        return todoTaskRepository.findById(taskId).map(task -> {
            task.setCompleted(updatedTask.isCompleted());
            return todoTaskRepository.save(task);
        }).orElseThrow(() -> new RuntimeException("Task not found"));
    }

    // Delete a task
    @DeleteMapping("/delete/{taskId}")
    public void deleteTask(@PathVariable Long taskId) {
        todoTaskRepository.deleteById(taskId);
    }
}
