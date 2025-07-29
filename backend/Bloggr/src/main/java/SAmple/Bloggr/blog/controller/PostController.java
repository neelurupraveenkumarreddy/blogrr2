package SAmple.Bloggr.blog.controller;

import SAmple.Bloggr.blog.model.Post;
import SAmple.Bloggr.blog.repository.PostRepository;
import SAmple.Bloggr.blog.repository.PostViewRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private PostViewRepository postViewRepository;

    // Create Post (Anyone logged-in can create; attach authorId from JWT)
    @PostMapping("/secure/create")
    public Map<String, Object> createPost(@RequestBody Post post, HttpServletRequest request) {
        try {
            int userId = (int) request.getAttribute("userId"); // from JwtFilter
            post.setAuthor_id(userId);

            int postId = postRepository.savePost(post);
            return Map.of(
                    "message", "Post added successfully!",
                    "postId", postId
            );
        } catch (Exception e) {
            return Map.of("error", "Error creating post: " + e.getMessage());
        }
    }

    // Get All Posts
    @GetMapping
    public Object getAllPosts() {
        try {
            return postRepository.getAllPostsWithTags();
        } catch (Exception e) {
            return Map.of("error", "Error fetching posts with tags: " + e.getMessage());
        }
    }

    // Get Post By ID
    @GetMapping("/{id}")
    public Object getPostById(@PathVariable int id) {
        try {
            Post post = postRepository.getPostById(id);
            return (post != null)
                    ? post
                    : Map.of("error", "Post not found with ID: " + id);
        } catch (Exception e) {
            return Map.of("error", "Error fetching post: " + e.getMessage());
        }
    }

    // Update Post (Only owner or admin)
    @PutMapping("/secure/{id}")
    public Map<String, String> updatePost(
            @PathVariable int id,
            @RequestBody Post updatedPost,
            HttpServletRequest request) {
        try {
            int requesterId = (int) request.getAttribute("userId");
            String role = (String) request.getAttribute("role");

            Post existingPost = postRepository.getPostById(id);
            if (existingPost == null) {
                return Map.of("error", "Post not found");
            }

            // Only owner or admin can update
            if (!"ADMIN".equals(role) && existingPost.getAuthor_id() != requesterId) {
                return Map.of("error", "You are not allowed to update this post");
            }

            updatedPost.setId(id);
            int result = postRepository.updatePost(updatedPost);
            return (result > 0)
                    ? Map.of("message", "Post updated successfully!")
                    : Map.of("error", "Failed to update post.");
        } catch (Exception e) {
            return Map.of("error", "Error updating post: " + e.getMessage());
        }
    }

    // Delete Post (Only owner or admin)
    @DeleteMapping("/secure/{id}")
    public Map<String, String> deletePost(@PathVariable int id, HttpServletRequest request) {
        try {
            int requesterId = (int) request.getAttribute("userId");
            String role = (String) request.getAttribute("role");

            Post existingPost = postRepository.getPostById(id);
            if (existingPost == null) {
                return Map.of("error", "Post not found");
            }

            // Only owner or admin can delete
            if (!"ADMIN".equals(role) && existingPost.getAuthor_id() != requesterId) {
                return Map.of("error", "You are not allowed to delete this post");
            }

            int result = postRepository.deletePost(id);
            return (result > 0)
                    ? Map.of("message", "Post deleted successfully!")
                    : Map.of("error", "Failed to delete post.");
        } catch (Exception e) {
            return Map.of("error", "Error deleting post: " + e.getMessage());
        }
    }

    // Get Posts with Names
    @GetMapping("/postswithnames")
    public Object getAllPostsWithNamesObject() {
        try {
            return postViewRepository.getAllPostsWithTagsAndNames();
        } catch (Exception e) {
            return Map.of("error", "Error fetching posts: " + e.getMessage());
        }
    }
}
