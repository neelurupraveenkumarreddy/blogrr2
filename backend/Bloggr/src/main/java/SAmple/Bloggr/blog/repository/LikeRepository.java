package SAmple.Bloggr.blog.repository;

import SAmple.Bloggr.blog.model.Like;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class LikeRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Add a like
    public int addLike(Like like) {
        String sql = "INSERT INTO likes (user_id, post_id) VALUES (?, ?)";
        return jdbcTemplate.update(sql, like.getUser_id(), like.getPost_id());
    }

    // Remove a like
    public int removeLike(int userId, int postId) {
        String sql = "DELETE FROM likes WHERE user_id = ? AND post_id = ?";
        return jdbcTemplate.update(sql, userId, postId);
    }

    // Count likes for a post
    public int countLikesByPost(int postId) {
        String sql = "SELECT COUNT(*) FROM likes WHERE post_id = ?";
        return jdbcTemplate.queryForObject(sql, Integer.class, postId);
    }

    // Check if a user liked a post
    public boolean userLikedPost(int userId, int postId) {
        String sql = "SELECT COUNT(*) FROM likes WHERE user_id = ? AND post_id = ?";
        int count = jdbcTemplate.queryForObject(sql, Integer.class, userId, postId);
        return count > 0;
    }

    // Get all likes by a post
    public List<Like> getLikesByPost(int postId) {
        String sql = "SELECT * FROM likes WHERE post_id = ?";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Like.class), postId);
    }
}
