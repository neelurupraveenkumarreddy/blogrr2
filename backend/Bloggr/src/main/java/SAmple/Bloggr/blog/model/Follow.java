package SAmple.Bloggr.blog.model;

import java.sql.Timestamp;

public class Follow {
    private int followerId;
    private int followeeId;
    private Timestamp followedAt;

    // Getters and Setters
    public int getFollowerId() {
        return followerId;
    }

    public void setFollowerId(int followerId) {
        this.followerId = followerId;
    }

    public int getFolloweeId() {
        return followeeId;
    }

    public void setFolloweeId(int followeeId) {
        this.followeeId = followeeId;
    }

    public Timestamp getFollowedAt() {
        return followedAt;
    }

    public void setFollowedAt(Timestamp followedAt) {
        this.followedAt = followedAt;
    }
}
