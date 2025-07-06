package SAmple.Bloggr.blog.controller;

import SAmple.Bloggr.blog.model.Post;
import SAmple.Bloggr.blog.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostRepository postRepository;

    @PostMapping("/create")
    public Map<String, Object> createPost(@RequestBody Post post) {
    try {
        int postId = postRepository.savePost(post);
        System.out.println("Created post ID: " + postId);

        return Map.of(
            "message", "Post added successfully!",
            "postId", postId
        );
    } catch (Exception e) {
        return Map.of("error", "Error creating post: " + e.getMessage());
    }
}
    @GetMapping
public Object getAllPosts() {
    try {
        return postRepository.getAllPostsWithTags();
    } catch (Exception e) {
        return Map.of("error", "Error fetching posts with tags: " + e.getMessage());
    }
}


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

    @PutMapping("/{id}")
    public Map<String, String> updatePost(@PathVariable int id, @RequestBody Post updatedPost) {
        try {
            updatedPost.setId(id);
            int result = postRepository.updatePost(updatedPost);
            return (result > 0)
                ? Map.of("message", "Post updated successfully!")
                : Map.of("error", "Failed to update post.");
        } catch (Exception e) {
            return Map.of("error", "Error updating post: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public Map<String, String> deletePost(@PathVariable int id) {
        try {
            int result = postRepository.deletePost(id);
            return (result > 0)
                ? Map.of("message", "Post deleted successfully!")
                : Map.of("error", "Failed to delete post.");
        } catch (Exception e) {
            return Map.of("error", "Error deleting post: " + e.getMessage());
        }
    }
}
