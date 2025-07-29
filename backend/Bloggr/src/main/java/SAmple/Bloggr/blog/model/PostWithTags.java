package SAmple.Bloggr.blog.model;

import java.sql.Timestamp;
import java.util.List;

public class PostWithTags {
    private int id;
    private String title;
    private String content;
    private int category_id;
    private int author_id;
    private String image_url;
    private Timestamp created_at;
    private Timestamp updated_at;
    private List<Tag> tags;
    private String authorName;
    private String categoryName;

    // Getters and Setters
    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    // Getters and Setters
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }
    public void setContent(String content) {
        this.content = content;
    }

    public int getCategory_id() {
        return category_id;
    }
    public void setCategory_id(int category_id) {
        this.category_id = category_id;
    }

    public int getAuthor_id() {
        return author_id;
    }
    public void setAuthor_id(int author_id) {
        this.author_id = author_id;
    }

    public String getImage_url() {
        return image_url;
    }
    public void setImage_url(String image_url) {
        this.image_url = image_url;
    }

    public Timestamp getCreated_at() {
        return created_at;
    }
    public void setCreated_at(Timestamp created_at) {
        this.created_at = created_at;
    }

    public Timestamp getUpdated_at() {
        return updated_at;
    }
    public void setUpdated_at(Timestamp updated_at) {
        this.updated_at = updated_at;
    }

    public List<Tag> getTags() {
        return tags;
    }
    public void setTags(List<Tag> tags) {
        this.tags = tags;
    }
}
