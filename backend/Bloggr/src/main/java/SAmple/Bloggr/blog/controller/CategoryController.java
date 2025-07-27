package SAmple.Bloggr.blog.controller;

import SAmple.Bloggr.blog.model.Category;
import SAmple.Bloggr.blog.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/categories")

public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    @PostMapping("/secure/create")
    public Map<String, String> createCategory(@RequestBody Category category) {
        try {
            int result = categoryRepository.createCategory(category);
            return (result > 0)
                ? Map.of("message", "Category created successfully!")
                : Map.of("error", "Failed to create category.");
        } catch (Exception e) {
            return Map.of("error", "Error creating category: " + e.getMessage());
        }
    }

    @GetMapping
    public Object getAllCategories() {
        try {
            return categoryRepository.getAllCategories();
        } catch (Exception e) {
            return Map.of("error", "Error fetching categories: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public Object getCategoryById(@PathVariable int id) {
        try {
            Category cat = categoryRepository.getCategoryById(id);
            return (cat != null)
                ? cat
                : Map.of("error", "Category not found with ID: " + id);
        } catch (Exception e) {
            return Map.of("error", "Error fetching category: " + e.getMessage());
        }
    }

    @PutMapping("/secure/{id}")
    public Map<String, String> updateCategory(@PathVariable int id, @RequestBody Category category) {
        try {
            category.setId(id);
            int result = categoryRepository.updateCategory(category);
            return (result > 0)
                ? Map.of("message", "Category updated successfully!")
                : Map.of("error", "Failed to update category.");
        } catch (Exception e) {
            return Map.of("error", "Error updating category: " + e.getMessage());
        }
    }

    @DeleteMapping("/secure/{id}")
    public Map<String, String> deleteCategory(@PathVariable int id) {
        try {
            int result = categoryRepository.deleteCategory(id);
            return (result > 0)
                ? Map.of("message", "Category deleted successfully!")
                : Map.of("error", "Failed to delete category.");
        } catch (Exception e) {
            return Map.of("error", "Error deleting category: " + e.getMessage());
        }
    }
}
