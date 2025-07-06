package SAmple.Bloggr.blog.repository;

import SAmple.Bloggr.blog.model.Category;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CategoryRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Create
    public int createCategory(Category category) {
        String sql = "INSERT INTO categories (name) VALUES (?)";
        return jdbcTemplate.update(sql, category.getName());
    }

    // Read all
    public List<Category> getAllCategories() {
        String sql = "SELECT * FROM categories";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Category.class));
    }

    // Read by ID
    public Category getCategoryById(int id) {
        String sql = "SELECT * FROM categories WHERE id = ?";
        List<Category> list = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Category.class), id);
        return list.isEmpty() ? null : list.get(0);
    }

    // Update
    public int updateCategory(Category category) {
        String sql = "UPDATE categories SET name = ? WHERE id = ?";
        return jdbcTemplate.update(sql, category.getName(), category.getId());
    }

    // Delete
    public int deleteCategory(int id) {
        String sql = "DELETE FROM categories WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }
}
