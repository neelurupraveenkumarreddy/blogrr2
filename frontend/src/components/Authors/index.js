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
        fetch("http://localhost:8080/api/profiles"),
        fetch(`http://localhost:8080/api/follows/list/following/${currentUserId}`),
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
    console.log(Jtoken);
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
          <h2>Authors</h2>

          {loading && <p className="authors-loading">Loading authors...</p>}
          {error && <p className="authors-error">{error}</p>}

          <div className="authors-list">
            {authors.map((author) => {
              const isFollowing = followingIds.includes(author.userId);
              return (
                <div key={author.userId} className="author-card">
                  <Link to={`/profile/${author.userId}`} className="author-info">
                    <div className="author-profile">{author.displayName[0]}</div>
                    <div>
                      <h4>{author.displayName}</h4>
                      <p className="username">@{author.handle}</p>
                      <p className="bio">{author.bio}</p>
                    </div>
                  </Link>
                  <button
                    className={`follow-button ${isFollowing ? "unfollow" : "follow"}`}
                    onClick={() => this.toggleFollow(author.userId, isFollowing)}
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
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
