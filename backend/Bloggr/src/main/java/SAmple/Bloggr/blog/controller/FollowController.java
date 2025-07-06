package SAmple.Bloggr.blog.controller;

import SAmple.Bloggr.blog.model.Follow;
import SAmple.Bloggr.blog.model.Profile;
import SAmple.Bloggr.blog.repository.FollowRepository;
import SAmple.Bloggr.blog.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/follows")
public class FollowController {
    @Autowired private FollowRepository repo;
    @Autowired private ProfileRepository profileRepo;

    // Follow a user
    @PostMapping("/follow")
    public ResponseEntity<Map<String, Object>> follow(
        @RequestParam int followerId,
        @RequestParam int followeeId
    ) {
        int result = repo.follow(followerId, followeeId);
        if (result > 0) {
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Now following"
            ));
        }
        return ResponseEntity.badRequest().body(Map.of(
            "success", false,
            "message", "Failed to follow"
        ));
    }

    // Unfollow a user
    @PostMapping("/unfollow")
    public ResponseEntity<Map<String, Object>> unfollow(
        @RequestParam int followerId,
        @RequestParam int followeeId
    ) {
        int result = repo.unfollow(followerId, followeeId);
        if (result > 0) {
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Unfollowed"
            ));
        }
        return ResponseEntity.badRequest().body(Map.of(
            "success", false,
            "message", "Failed to unfollow"
        ));
    }

    // Count followers
    @GetMapping("/count/followers/{userId}")
    public ResponseEntity<Map<String, Integer>> countFollowers(@PathVariable int userId) {
        int count = repo.countFollowers(userId);
        return ResponseEntity.ok(Map.of("followers", count));
    }

    // Count following
    @GetMapping("/count/following/{userId}")
    public ResponseEntity<Map<String, Integer>> countFollowing(@PathVariable int userId) {
        int count = repo.countFollowing(userId);
        return ResponseEntity.ok(Map.of("following", count));
    }

    // List raw Follow records of followers
    @GetMapping("/list/followers/{userId}")
    public ResponseEntity<List<Follow>> listFollowers(@PathVariable int userId) {
        return ResponseEntity.ok(repo.findFollowers(userId));
    }

    // List raw Follow records of following
    @GetMapping("/list/following/{userId}")
    public ResponseEntity<List<Follow>> listFollowing(@PathVariable int userId) {
        return ResponseEntity.ok(repo.findFollowing(userId));
    }

    // List Profile details of followers
    @GetMapping("/profiles/followers/{userId}")
    public ResponseEntity<List<Profile>> followerProfiles(@PathVariable int userId) {
        List<Follow> followers = repo.findFollowers(userId);
        List<Profile> profiles = followers.stream()
            .map(f -> profileRepo.findByUserId(f.getFollowerId()))
            .filter(p -> p != null)
            .collect(Collectors.toList());
        return ResponseEntity.ok(profiles);
    }

    // List Profile details of users this user is following
    @GetMapping("/profiles/following/{userId}")
    public ResponseEntity<List<Profile>> followingProfiles(@PathVariable int userId) {
        List<Follow> following = repo.findFollowing(userId);
        List<Profile> profiles = following.stream()
            .map(f -> profileRepo.findByUserId(f.getFolloweeId()))
            .filter(p -> p != null)
            .collect(Collectors.toList());
        return ResponseEntity.ok(profiles);
    }
}