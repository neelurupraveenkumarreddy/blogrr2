package SAmple.Bloggr.blog.repository;

import SAmple.Bloggr.blog.model.Profile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ProfileRepository {
    @Autowired
    private JdbcTemplate jdbc;

    // CREATE
    public int create(Profile p) {
        String sql = """
            INSERT INTO profiles
              (user_id, display_name, handle, avatar_url, bio)
            VALUES (?, ?, ?, ?, ?)
        """;
        return jdbc.update(sql,
            p.getUserId(),
            p.getDisplayName(),
            p.getHandle(),
            p.getAvatarUrl(),
            p.getBio()
        );
    }

    // READ ALL
    public List<Profile> findAll() {
        String sql = "SELECT * FROM profiles";
        return jdbc.query(sql, new BeanPropertyRowMapper<>(Profile.class));
    }

    // READ BY userId
    public Profile findByUserId(int userId) {
        String sql = "SELECT * FROM profiles WHERE user_id = ?";
        List<Profile> list = jdbc.query(sql, new BeanPropertyRowMapper<>(Profile.class), userId);
        return list.isEmpty() ? null : list.get(0);
    }

    // UPDATE
    public int update(Profile p) {
        String sql = """
            UPDATE profiles SET
              display_name = ?,
              handle = ?,
              avatar_url = ?,
              bio = ?,
              updated_at = CURRENT_TIMESTAMP
            WHERE user_id = ?
        """;
        return jdbc.update(sql,
            p.getDisplayName(),
            p.getHandle(),
            p.getAvatarUrl(),
            p.getBio(),
            p.getUserId()
        );
    }

    // DELETE
    public int deleteByUserId(int userId) {
        String sql = "DELETE FROM profiles WHERE user_id = ?";
        return jdbc.update(sql, userId);
    }
}
