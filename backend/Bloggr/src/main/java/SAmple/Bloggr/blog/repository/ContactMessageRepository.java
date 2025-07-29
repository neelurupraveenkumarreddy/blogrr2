package SAmple.Bloggr.blog.repository;

import SAmple.Bloggr.blog.model.ContactMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ContactMessageRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Save message
    public int save(ContactMessage msg) {
        String sql = "INSERT INTO contact_messages (full_name, email, message) VALUES (?, ?, ?)";
        return jdbcTemplate.update(sql, msg.getFullName(), msg.getEmail(), msg.getMessage());
    }

    // Get all messages
    public List<ContactMessage> findAll() {
        String sql = "SELECT * FROM contact_messages ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(ContactMessage.class));
    }

    // Mark message as read
    public int markAsRead(int id) {
        String sql = "UPDATE contact_messages SET is_read = TRUE WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }

    // Delete message
    public int delete(int id) {
        String sql = "DELETE FROM contact_messages WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }
}
