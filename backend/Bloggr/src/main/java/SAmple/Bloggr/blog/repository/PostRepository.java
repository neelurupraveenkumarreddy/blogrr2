package SAmple.Bloggr.blog.repository;

import SAmple.Bloggr.blog.model.Tag;
import org.springframework.beans.BeanUtils;
import java.util.ArrayList;
import SAmple.Bloggr.blog.model.Post;
import SAmple.Bloggr.blog.model.PostWithTags;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class PostRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // CREATE
    public int savePost(Post post) {
        String sql = "INSERT INTO posts (title, content, category_id, author_id, image_url) VALUES (?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql,
            post.getTitle(),
            post.getContent(),
            post.getCategory_id(),
            post.getAuthor_id(),
            post.getImage_url()
        );
        return jdbcTemplate.queryForObject("SELECT LAST_INSERT_ID()", Integer.class);
    }

    // READ ALL
    public List<Post> getAllPosts() {
        String sql = "SELECT * FROM posts";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Post.class));
    }

    public List<PostWithTags> getAllPostsWithTags() {
    String sql = "SELECT * FROM posts";
    List<Post> posts = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Post.class));

    List<PostWithTags> result = new ArrayList<>();
    for (Post post : posts) {
        PostWithTags postWithTags = new PostWithTags();
        BeanUtils.copyProperties(post, postWithTags);

        String tagSql = "SELECT t.* FROM tags t JOIN post_tags pt ON t.id = pt.tag_id WHERE pt.post_id = ?";
        List<Tag> tags = jdbcTemplate.query(tagSql, new BeanPropertyRowMapper<>(Tag.class), post.getId());
        postWithTags.setTags(tags);

        result.add(postWithTags);
    }

    return result;
}

    
    // READ BY ID
    public Post getPostById(int id) {
        String sql = "SELECT * FROM posts WHERE id = ?";
        List<Post> posts = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Post.class), id);
        return posts.isEmpty() ? null : posts.get(0);
    }

    // UPDATE
    public int updatePost(Post post) {
        String sql = "UPDATE posts SET title = ?, content = ?, category_id = ?, author_id = ?, image_url = ? WHERE id = ?";
        return jdbcTemplate.update(sql,
            post.getTitle(),
            post.getContent(),
            post.getCategory_id(),
            post.getAuthor_id(),
            post.getImage_url(),
            post.getId()
        );
    }

    // DELETE
    public int deletePost(int id) {
        String sql = "DELETE FROM posts WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }
}
