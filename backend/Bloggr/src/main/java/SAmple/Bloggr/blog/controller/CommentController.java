package SAmple.Bloggr.blog.controller;

import SAmple.Bloggr.blog.model.Comment;
import SAmple.Bloggr.blog.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentRepository commentRepository;

    @PostMapping("/secure/create")
    public Map<String, String> createComment(@RequestBody Comment comment) {
        try {
            int result = commentRepository.createComment(comment);
            return (result > 0)
                ? Map.of("message", "Comment added successfully!")
                : Map.of("error", "Failed to add comment.");
        } catch (Exception e) {
            return Map.of("error", "Error creating comment: " + e.getMessage());
        }
    }

    @GetMapping("/post/{postId}")
    public Object getCommentsByPost(@PathVariable int postId) {
        try {
            return commentRepository.getCommentsByPostId(postId);
        } catch (Exception e) {
            return Map.of("error", "Error fetching comments: " + e.getMessage());
        }
    }

    @PutMapping("/secure/{id}")
    public Map<String, String> updateComment(@PathVariable int id, @RequestBody Comment comment) {
        try {
            comment.setId(id);
            int result = commentRepository.updateComment(comment);
            return (result > 0)
                ? Map.of("message", "Comment updated successfully!")
                : Map.of("error", "Failed to update comment.");
        } catch (Exception e) {
            return Map.of("error", "Error updating comment: " + e.getMessage());
        }
    }

    @DeleteMapping("/secure/{id}")
    public Map<String, String> deleteComment(@PathVariable int id) {
        try {
            int result = commentRepository.deleteComment(id);
            return (result > 0)
                ? Map.of("message", "Comment deleted successfully!")
                : Map.of("error", "Failed to delete comment.");
        } catch (Exception e) {
            return Map.of("error", "Error deleting comment: " + e.getMessage());
        }
    }
}
