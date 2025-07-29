package SAmple.Bloggr.blog.controller;

import SAmple.Bloggr.blog.model.ContactMessage;
import SAmple.Bloggr.blog.repository.ContactMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
public class ContactMessageController {

    @Autowired
    private ContactMessageRepository repo;

    // Public endpoint for submitting contact form
    @PostMapping
    public ResponseEntity<Map<String, String>> submitMessage(@RequestBody ContactMessage msg) {
        int result = repo.save(msg);
        return (result > 0)
                ? ResponseEntity.ok(Map.of("message", "Message submitted successfully"))
                : ResponseEntity.badRequest().body(Map.of("error", "Failed to submit message"));
    }

    // Admin-only: Get all messages
    @GetMapping("/secure/all")
    public ResponseEntity<List<ContactMessage>> getAllMessages() {
        return ResponseEntity.ok(repo.findAll());
    }

    // Admin-only: Mark as read
    @PutMapping("/secure/read/{id}")
    public ResponseEntity<Map<String, String>> markAsRead(@PathVariable int id) {
        int result = repo.markAsRead(id);
        System.out.println(result);
        return (result > 0)
                ? ResponseEntity.ok(Map.of("message", "Message marked as read"))
                : ResponseEntity.status(404).body(Map.of("error", "Message not found"));
    }

    // Admin-only: Delete message
    @DeleteMapping("/secure/{id}")
    public ResponseEntity<Map<String, String>> deleteMessage(@PathVariable int id) {
        int result = repo.delete(id);
        return (result > 0)
                ? ResponseEntity.ok(Map.of("message", "Message deleted successfully"))
                : ResponseEntity.status(404).body(Map.of("error", "Message not found"));
    }
}
