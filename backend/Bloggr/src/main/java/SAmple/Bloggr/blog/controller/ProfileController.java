package SAmple.Bloggr.blog.controller;

import SAmple.Bloggr.blog.model.Profile;
import SAmple.Bloggr.blog.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/profiles")
public class ProfileController {
    @Autowired
    private ProfileRepository repo;

    // Create new profile
    @PostMapping("/secure/create")
    public ResponseEntity<Map<String, String>> createProfile(@RequestBody Profile p) {
        try {
            int result = repo.create(p);
            if (result > 0) {
                return ResponseEntity.ok(Map.of("message", "Profile created successfully"));
            }
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to create profile"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // Get all profiles
    @GetMapping
    public ResponseEntity<List<Profile>> getAllProfiles() {
        try {
            List<Profile> list = repo.findAll();
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    // Get profile by userId
    @GetMapping("/{userId}")
    public ResponseEntity<?> getProfile(@PathVariable int userId) {
        Profile p = repo.findByUserId(userId);
        if (p == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Profile not found"));
        }
        return ResponseEntity.ok(p);
    }

    // Update profile (user can update only their own OR admin can update any)
    @PutMapping("/secure/{userId}")
    public ResponseEntity<Map<String, String>> updateProfile(
            @PathVariable int userId,
            @RequestBody Profile p,
            HttpServletRequest request
    ) {
        try {
            int requesterId = (int) request.getAttribute("userId");
            String role = (String) request.getAttribute("role");

            // Check permissions
            if (!"ADMIN".equals(role) && requesterId != userId) {
                return ResponseEntity.status(403).body(Map.of("error", "You can only update your own profile"));
            }

            p.setUserId(userId);
            int result = repo.update(p);
            if (result > 0) {
                return ResponseEntity.ok(Map.of("message", "Profile updated successfully"));
            }
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to update profile"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // Delete profile (user can delete only their own OR admin can delete any)
    @DeleteMapping("/secure/{userId}")
    public ResponseEntity<Map<String, String>> deleteProfile(
            @PathVariable int userId,
            HttpServletRequest request
    ) {
        try {
            int requesterId = (int) request.getAttribute("userId");
            String role = (String) request.getAttribute("role");

            // Check permissions
            if (!"ADMIN".equals(role) && requesterId != userId) {
                return ResponseEntity.status(403).body(Map.of("error", "You can only delete your own profile"));
            }

            int result = repo.deleteByUserId(userId);
            if (result > 0) {
                return ResponseEntity.ok(Map.of("message", "Profile deleted successfully"));
            }
            return ResponseEntity.status(404).body(Map.of("error", "Profile not found"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}
