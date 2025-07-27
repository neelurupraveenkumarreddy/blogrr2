package SAmple.Bloggr.blog.repository;

import SAmple.Bloggr.blog.model.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class TagRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public int createTag(Tag tag) {
        String sql = "INSERT INTO tags (name) VALUES (?)";
        return jdbcTemplate.update(sql, tag.getName());
    }

    public int assignTagToPost(int postId, int tagId) {
        String sql = "INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)";
        return jdbcTemplate.update(sql, postId, tagId);
    }

    public List<Tag> getTagsByPostId(int postId) {
        String sql = "SELECT t.* FROM tags t " +
                     "JOIN post_tags pt ON t.id = pt.tag_id " +
                     "WHERE pt.post_id = ?";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Tag.class), postId);
    }

    public int deleteTag(int id) {
    // Optional: remove from post_tags first to avoid FK constraint errors
    jdbcTemplate.update("DELETE FROM post_tags WHERE tag_id = ?", id);
    return jdbcTemplate.update("DELETE FROM tags WHERE id = ?", id);
    }

    public int removeTagFromPost(int postId, int tagId) {
        String sql = "DELETE FROM post_tags WHERE post_id = ? AND tag_id = ?";
        return jdbcTemplate.update(sql, postId, tagId);
    }

    public List<Tag> getAllTags() {
        String sql = "SELECT * FROM tags";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Tag.class));
    }
    
    public List<int[]> getAllPostTags() {
    String sql = "SELECT post_id, tag_id FROM post_tags";
    return jdbcTemplate.query(sql, (rs, rowNum) -> new int[]{
        rs.getInt("post_id"),
        rs.getInt("tag_id")
    });
}


    public Tag findTagByName(String name) {
        String sql = "SELECT * FROM tags WHERE name = ?";
        List<Tag> tags = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Tag.class), name);
        return tags.isEmpty() ? null : tags.get(0);
    }

    public int createOrGetTagId(String tagName) {
        Tag existing = findTagByName(tagName);
        if (existing != null) {
            return existing.getId();
        }
        createTag(new Tag(tagName));
        return jdbcTemplate.queryForObject("SELECT LAST_INSERT_ID()", Integer.class);
    }
}
