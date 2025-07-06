package SAmple.Bloggr.blog.repository;

import java.util.List;
import SAmple.Bloggr.blog.model.Follow;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class FollowRepository {
    @Autowired private JdbcTemplate jdbc;

    // Follow a user
    public int follow(int followerId, int followeeId) {
        String sql = "INSERT INTO follows (follower_id, followee_id) VALUES (?, ?)";
        return jdbc.update(sql, followerId, followeeId);
    }

    // Unfollow a user
    public int unfollow(int followerId, int followeeId) {
        String sql = "DELETE FROM follows WHERE follower_id = ? AND followee_id = ?";
        return jdbc.update(sql, followerId, followeeId);
    }

    // Count followers of a user
    public int countFollowers(int userId) {
        String sql = "SELECT COUNT(*) FROM follows WHERE followee_id = ?";
        return jdbc.queryForObject(sql, Integer.class, userId);
    }

    // Count users a user is following
    public int countFollowing(int userId) {
        String sql = "SELECT COUNT(*) FROM follows WHERE follower_id = ?";
        return jdbc.queryForObject(sql, Integer.class, userId);
    }

    // List raw Follow records of followers
    public List<Follow> findFollowers(int userId) {
        String sql = "SELECT * FROM follows WHERE followee_id = ?";
        return jdbc.query(sql, new BeanPropertyRowMapper<>(Follow.class), userId);
    }

    // List raw Follow records of following
    public List<Follow> findFollowing(int userId) {
        String sql = "SELECT * FROM follows WHERE follower_id = ?";
        return jdbc.query(sql, new BeanPropertyRowMapper<>(Follow.class), userId);
    }
}
