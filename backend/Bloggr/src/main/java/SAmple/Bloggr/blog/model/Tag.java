package SAmple.Bloggr.blog.model;

public class Tag {
    private int id;
    private String name;

    public Tag() {}

    public Tag(String name) {
        this.name = name;
    }

    // Getters & Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}
