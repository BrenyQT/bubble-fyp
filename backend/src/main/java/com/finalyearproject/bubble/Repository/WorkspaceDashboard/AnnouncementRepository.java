package com.finalyearproject.bubble.Repository.WorkspaceDashboard;

import com.finalyearproject.bubble.Entity.WorkspaceDashboard.Announcement;
import com.finalyearproject.bubble.Entity.Workspaces.Workspaces;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    // Returns a list of announcements from a workspace
    List<Announcement> findByWorkspace(Workspaces workspace);
}
