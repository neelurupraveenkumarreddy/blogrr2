package SAmple.Bloggr.blog.controller;

import SAmple.Bloggr.blog.model.Tag;
import SAmple.Bloggr.blog.repository.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/tags")
public class TagController {

    @Autowired
    private TagRepository tagRepository;

    @PostMapping
    public Map<String, String> createTag(@RequestBody Tag tag) {
        try {
            int result = tagRepository.createTag(tag);
            return (result > 0)
                ? Map.of("message", "Tag created successfully!")
                : Map.of("error", "Failed to create tag.");
        } catch (Exception e) {
            return Map.of("error", "Error creating tag: " + e.getMessage());
        }
    }

    @PostMapping("/assign")
    public Map<String, String> assignTag(
        @RequestParam int postId,
        @RequestParam int tagId
    ) {
        try {
            int result = tagRepository.assignTagToPost(postId, tagId);
            return (result > 0)
                ? Map.of("message", "Tag assigned to post.")
                : Map.of("error", "Failed to assign tag.");
        } catch (Exception e) {
            return Map.of("error", "Error assigning tag: " + e.getMessage());
        }
    }

    @PostMapping("/create-or-assign")
    public Map<String, Object> createOrAssignTags(
        @RequestParam int postId,
        @RequestBody List<String> tagNames
    ) {
        List<String> createdTags = new ArrayList<>();
        try {
            for (String tagName : tagNames) {
                int tagId = tagRepository.createOrGetTagId(tagName.trim());
                tagRepository.assignTagToPost(postId, tagId);
                createdTags.add(tagName);
            }
            return Map.of("message", "Tags assigned to post", "tags", createdTags);
        } catch (Exception e) {
            return Map.of("error", "Failed to assign tags: " + e.getMessage());
        }
    }

    @GetMapping("/post/{postId}")
    public Object getTagsByPost(@PathVariable int postId) {
        try {
            return tagRepository.getTagsByPostId(postId);
        } catch (Exception e) {
            return Map.of("error", "Error fetching tags: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
public Map<String, String> deleteTag(@PathVariable int id) {
    try {
        int result = tagRepository.deleteTag(id);
        return (result > 0)
            ? Map.of("message", "Tag deleted successfully")
            : Map.of("error", "Tag not found or in use");
    } catch (Exception e) {
        return Map.of("error", "Error deleting tag: " + e.getMessage());
    }
}


    @DeleteMapping("/remove")
    public Map<String, String> removeTagFromPost(
        @RequestParam int postId,
        @RequestParam int tagId
    ) {
        try {
            int result = tagRepository.removeTagFromPost(postId, tagId);
            return (result > 0)
                ? Map.of("message", "Tag removed from post.")
                : Map.of("error", "Failed to remove tag.");
        } catch (Exception e) {
            return Map.of("error", "Error removing tag: " + e.getMessage());
        }
    }

    @GetMapping
    public Object getAllTags() {
        try {
            return tagRepository.getAllTags();
        } catch (Exception e) {
            return Map.of("error", "Error fetching tags: " + e.getMessage());
        }
    }
    @GetMapping("/post-tags")
public Object getAllPostTags() {
    try {
        return tagRepository.getAllPostTags();
    } catch (Exception e) {
        return Map.of("error", "Error fetching post-tags: " + e.getMessage());
    }
}
}
