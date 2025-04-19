package com.finalyearproject.bubble.Controller.WorkspaceDashboard;

import com.finalyearproject.bubble.Entity.WorkspaceDashboard.Announcement;
import com.finalyearproject.bubble.Repository.WorkspaceDashboard.AnnouncementRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;



@RestController
@RequestMapping("/announcement")
public class AnnouncementController {

        private final AnnouncementRepository announcementRepository;

        public AnnouncementController(AnnouncementRepository announcementRepository) {
            this.announcementRepository = announcementRepository;
        }

        // Return the Announcement by ID
    @GetMapping("/{announcementId}")
    public Announcement getAnnouncementById(@PathVariable Long announcementId) {
        return announcementRepository.findById(announcementId)
                .orElseThrow(() -> new RuntimeException("cant get the announcement "));
    }



}
