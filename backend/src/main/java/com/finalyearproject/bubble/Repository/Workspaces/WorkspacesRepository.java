package com.finalyearproject.bubble.Repository.Workspaces;

import com.finalyearproject.bubble.Entity.Workspaces.Workspaces;
import com.finalyearproject.bubble.Entity.Authentication.oAuthUserDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

// Returns ID
@Repository
public interface WorkspacesRepository extends JpaRepository<Workspaces, Integer> {

    List<Workspaces> findByUsersContaining(oAuthUserDetails user);

    Optional<Workspaces> findByCode(String code);

    //  find a workspace by its id
    Optional<Workspaces> findById(Long id);
}
