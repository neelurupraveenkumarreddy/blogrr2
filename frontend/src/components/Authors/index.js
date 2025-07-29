import React, { Component } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Navbar";
import Cookies from 'js-cookie'
import "./authors.css";

class Authors extends Component {
  state = {
    authors: [],
    followingIds: [],
    currentUserId: null,
    loading: true,
    error: null,
    Jtoken:"",
  };

  componentDidMount() {
    const jwtToken=Cookies.get("jwt_token");
    if(jwtToken){
    const user = JSON.parse(localStorage.getItem("user"));
    this.setState({ currentUserId: user.id,Jtoken:jwtToken }, this.fetchAuthors);
    }else {
      this.setState({ error: "User not logged in", loading: false });
      return;
    }
  }

  fetchAuthors = async () => {
    const { currentUserId } = this.state;
    try {
      const [allRes, followingRes] = await Promise.all([
        fetch("/api/profiles"),
        fetch(`/api/follows/list/following/${currentUserId}`),
      ]);

      if (!allRes.ok || !followingRes.ok) throw new Error("Failed to fetch authors");

      const allAuthors = await allRes.json();
      const followingList = await followingRes.json();
      const followingIds = followingList.map(f => f.followeeId);

      const filteredAuthors = allAuthors.filter(a => a.userId !== currentUserId);

      // Sort: followed authors first
      filteredAuthors.sort((a, b) => {
        const aFollowed = followingIds.includes(a.userId);
        const bFollowed = followingIds.includes(b.userId);
        return bFollowed - aFollowed;
      });

      this.setState({
        authors: filteredAuthors,
        followingIds,
        loading: false,
      });
    } catch (err) {
      this.setState({ error: err.message, loading: false });
    }
  };

  toggleFollow = async (followeeId, isFollowing) => {
    const { currentUserId,Jtoken } = this.state;
    const endpoint = isFollowing ? "unfollow" : "follow";
    try {
      const res = await fetch(`/api/secure/follows/${endpoint}?followerId=${currentUserId}&followeeId=${followeeId}`, {
        method: "POST",
        headers: {
    Authorization: `Bearer ${Jtoken}`,
    "Content-Type": "application/json"
  }
      });

      const data = await res.json();
      if (data.success) {
        this.fetchAuthors();
      } else {
        alert(data.message || "Failed to toggle follow");
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  render() {
    const { authors, loading, error, followingIds } = this.state;

    return (
      <>
        <Navbar />
        <div className="authors-page">
          <div className="authors-header">
            <h2 className="authors-title">Discover Authors</h2>
            <p className="authors-subtitle">Find and follow your favorite content creators</p>
          </div>

          {loading && (
            <div className="authors-loading">
              <div className="loading-spinner"></div>
              <p>Loading authors...</p>
            </div>
          )}
          
          {error && (
            <div className="authors-error">
              <i className="fas fa-exclamation-circle"></i>
              <p>{error}</p>
            </div>
          )}

          <div className="authors-list">
            {authors.map((author) => {
              const isFollowing = followingIds.includes(author.userId);
              return (
                <div key={author.userId} className="author-card">
                  <Link to={`/profile/${author.userId}`} className="author-info">
                    <div className="author-avatar">
                      <span className="avatar-initial">{author.displayName[0]}</span>
                    </div>
                    <div className="author-details">
                      <h4 className="author-name">{author.displayName}</h4>
                      <p className="author-handle">@{author.handle}</p>
                      {author.bio && <p className="author-bio">{author.bio}</p>}
                    </div>
                  </Link>
                  <button
                    className={`follow-button ${isFollowing ? "unfollow" : "follow"}`}
                    onClick={() => this.toggleFollow(author.userId, isFollowing)}
                  >
                    <i className={`fas fa-${isFollowing ? "user-minus" : "user-plus"}`}></i>
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  }
}

export default Authors;
