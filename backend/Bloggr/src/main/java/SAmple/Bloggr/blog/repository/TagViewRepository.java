package SAmple.Bloggr.blog.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class TagViewRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Get tags with post count
    public List<Map<String, Object>> getTagsWithPostCount() {
        String sql = """
            SELECT t.id, t.name, COUNT(pt.post_id) AS postCount
            FROM tags t
            LEFT JOIN post_tags pt ON t.id = pt.tag_id
            GROUP BY t.id, t.name
            ORDER BY t.name
        """;
        return jdbcTemplate.queryForList(sql);
    }
}
