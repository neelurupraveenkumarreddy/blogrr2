package SAmple.Bloggr.blog.repository;

import SAmple.Bloggr.blog.model.Comment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CommentRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Create comment
    public int createComment(Comment comment) {
        String sql = "INSERT INTO comments (post_id, user_id, comment_text) VALUES (?, ?, ?)";
        return jdbcTemplate.update(sql,
            comment.getPost_id(),
            comment.getUser_id(),
            comment.getComment_text()
        );
    }

    // Get comments by post
    public List<Comment> getCommentsByPostId(int postId) {
        String sql = "SELECT * FROM comments WHERE post_id = ? ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Comment.class), postId);
    }

    // Update comment text
    public int updateComment(Comment comment) {
        String sql = "UPDATE comments SET comment_text = ? WHERE id = ?";
        return jdbcTemplate.update(sql,
            comment.getComment_text(),
            comment.getId()
        );
    }

    // Delete comment
    public int deleteComment(int id) {
        String sql = "DELETE FROM comments WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }
}
