package SAmple.Bloggr.blog.repository;

import SAmple.Bloggr.blog.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class UserRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // CREATE
    public int createUser(User user) {
        String sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
        return jdbcTemplate.update(sql,
            user.getUsername(),
            user.getEmail(),
            passwordEncoder.encode(user.getPassword()) // hash password
        );
    }

    // READ ALL
    public List<User> getAllUsers() {
        String sql = "SELECT * FROM users";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(User.class));
    }

    // get usernames
    public Map<Integer, String> getUserIdToUsernameMap() {
        String sql = "SELECT id, username FROM users";
        return jdbcTemplate.query(sql, rs -> {
            Map<Integer, String> map = new java.util.HashMap<>();
            while (rs.next()) {
                map.put(rs.getInt("id"), rs.getString("username"));
            }
            return map;
        });
    }

    // READ BY ID
    public User getUserById(int id) {
        String sql = "SELECT * FROM users WHERE id = ?";
        List<User> users = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(User.class), id);
        return users.isEmpty() ? null : users.get(0);
    }

    // READ BY EMAIL
    public User findByEmail(String email) {
        String sql = "SELECT * FROM users WHERE email = ?";
        List<User> users = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(User.class), email);
        return users.isEmpty() ? null : users.get(0);
    }

    // UPDATE with role
    public int updateUser(User user) {
        String sql = "UPDATE users SET username = ?, email = ?, password = ?, role = ? WHERE id = ?";
        return jdbcTemplate.update(sql,
            user.getUsername(),
            user.getEmail(),
            passwordEncoder.encode(user.getPassword()), // hash updated password
            user.getRole(),
            user.getId()
        );
    }

    // DELETE
    public int deleteUser(int id) {
        String sql = "DELETE FROM users WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }
}
