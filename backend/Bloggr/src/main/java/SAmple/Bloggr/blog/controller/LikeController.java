package SAmple.Bloggr.blog.controller;

import SAmple.Bloggr.blog.model.Like;
import SAmple.Bloggr.blog.repository.LikeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/likes")
@CrossOrigin
public class LikeController {

    @Autowired
    private LikeRepository likeRepository;

    @PostMapping("/add")
    public Map<String, String> addLike(@RequestBody Like like) {
        try {
            int result = likeRepository.addLike(like);
            return (result > 0)
                ? Map.of("message", "Post liked!")
                : Map.of("error", "Failed to like post.");
        } catch (Exception e) {
            return Map.of("error", "Error liking post: " + e.getMessage());
        }
    }

    @DeleteMapping("/remove")
    public Map<String, String> removeLike(@RequestParam int userId, @RequestParam int postId) {
        try {
            int result = likeRepository.removeLike(userId, postId);
            return (result > 0)
                ? Map.of("message", "Like removed.")
                : Map.of("error", "Failed to remove like.");
        } catch (Exception e) {
            return Map.of("error", "Error removing like: " + e.getMessage());
        }
    }

    @GetMapping("/count/{postId}")
    public Map<String, Integer> countLikes(@PathVariable int postId) {
        try {
            int count = likeRepository.countLikesByPost(postId);
            return Map.of("likeCount", count);
        } catch (Exception e) {
            return Map.of("likeCount", 0); // or handle error separately
        }
    }

    @GetMapping("/user-liked")
    public Map<String, Boolean> userLiked(
        @RequestParam int userId,
        @RequestParam int postId
    ) {
        try {
            boolean liked = likeRepository.userLikedPost(userId, postId);
            return Map.of("liked", liked);
        } catch (Exception e) {
            return Map.of("liked", false);
        }
    }
}
