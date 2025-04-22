package com.finalyearproject.bubble.Services;

import com.finalyearproject.bubble.Entity.SprintBacklog.Sprint;
import com.finalyearproject.bubble.Repository.SprintBacklog.SprintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SprintService {

    @Autowired
    private SprintRepository sprintRepository;

    // set a sprint as current
    public void setCurrentSprint(Sprint sprint) {
//TO:DO make the logic for finding the current spint.active and remove ot and apply to new sprint.
        sprintRepository.save(sprint);
    }
}
