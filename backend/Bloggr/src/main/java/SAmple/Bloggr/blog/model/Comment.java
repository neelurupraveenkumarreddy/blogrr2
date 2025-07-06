package SAmple.Bloggr.blog.model;

import java.sql.Timestamp;

public class Comment {
    private int id;
    private int post_id;
    private int user_id;
    private String comment_text;
    private Timestamp created_at;

    // Getters and Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getPost_id() { return post_id; }
    public void setPost_id(int post_id) { this.post_id = post_id; }

    public int getUser_id() { return user_id; }
    public void setUser_id(int user_id) { this.user_id = user_id; }

    public String getComment_text() { return comment_text; }
    public void setComment_text(String comment_text) { this.comment_text = comment_text; }

    public Timestamp getCreated_at() { return created_at; }
    public void setCreated_at(Timestamp created_at) { this.created_at = created_at; }
}
