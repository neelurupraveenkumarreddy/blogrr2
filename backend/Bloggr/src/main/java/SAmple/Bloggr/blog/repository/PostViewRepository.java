package SAmple.Bloggr.blog.repository;

import SAmple.Bloggr.blog.model.PostWithTags;
import SAmple.Bloggr.blog.model.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class PostViewRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<PostWithTags> getAllPostsWithTagsAndNames() {
        String sql = "SELECT p.id, p.title, p.content, p.category_id, p.author_id, p.image_url, p.created_at, p.updated_at, " +
                     "u.username AS authorName, c.name AS categoryName " +
                     "FROM posts p " +
                     "LEFT JOIN users u ON p.author_id = u.id " +
                     "LEFT JOIN categories c ON p.category_id = c.id";

        List<PostWithTags> posts = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(PostWithTags.class));

        for (PostWithTags post : posts) {
            String tagSql = "SELECT t.* FROM tags t JOIN post_tags pt ON t.id = pt.tag_id WHERE pt.post_id = ?";
            List<Tag> tags = jdbcTemplate.query(tagSql, new BeanPropertyRowMapper<>(Tag.class), post.getId());
            post.setTags(tags);
        }

        return posts;
    }
}
