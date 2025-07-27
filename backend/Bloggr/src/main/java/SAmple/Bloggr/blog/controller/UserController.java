package SAmple.Bloggr.blog.controller;

import SAmple.Bloggr.blog.model.User;
import SAmple.Bloggr.blog.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/create")
    public ResponseEntity<Map<String, String>> createUser(@RequestBody User user) {
        try {
            int result = userRepository.createUser(user);
            if (result > 0) {
                return ResponseEntity.ok(Map.of("message", "User created successfully!"));
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "Failed to create user."));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error creating user: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        try {
            List<User> users = userRepository.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error fetching users: " + e.getMessage()));
        }
    }
    @GetMapping("/usernames")
public ResponseEntity<Map<Integer, String>> getUsernamesMap() {
    try {
        Map<Integer, String> userMap = userRepository.getUserIdToUsernameMap();
        return ResponseEntity.ok(userMap);
    } catch (Exception e) {
        return ResponseEntity.status(500).body(Map.of());
    }
}


    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable int id) {
        try {
            User user = userRepository.getUserById(id);
            if (user != null) {
                return ResponseEntity.ok(user);
            } else {
                return ResponseEntity.status(404).body(Map.of("error", "User not found with ID: " + id));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error fetching user: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, String>> updateUser(@PathVariable int id, @RequestBody User user) {
        try {
            user.setId(id);
            int result = userRepository.updateUser(user);
            if (result > 0) {
                return ResponseEntity.ok(Map.of("message", "User updated successfully!"));
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "Failed to update user."));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error updating user: " + e.getMessage()));
        }
    }

    @DeleteMapping("/secure/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable int id) {
        try {
            int result = userRepository.deleteUser(id);
            if (result > 0) {
                return ResponseEntity.ok(Map.of("message", "User deleted successfully!"));
            } else {
                return ResponseEntity.status(404).body(Map.of("error", "Failed to delete user."));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error deleting user: " + e.getMessage()));
        }
    }
}

