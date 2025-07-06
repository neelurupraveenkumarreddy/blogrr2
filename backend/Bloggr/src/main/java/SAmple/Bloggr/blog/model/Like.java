package SAmple.Bloggr.blog.model;

import java.sql.Timestamp;

public class Like {
    private int id;
    private int user_id;
    private int post_id;
    private Timestamp created_at;

    // Getters and Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getUser_id() { return user_id; }
    public void setUser_id(int user_id) { this.user_id = user_id; }

    public int getPost_id() { return post_id; }
    public void setPost_id(int post_id) { this.post_id = post_id; }

    public Timestamp getCreated_at() { return created_at; }
    public void setCreated_at(Timestamp created_at) { this.created_at = created_at; }
}
