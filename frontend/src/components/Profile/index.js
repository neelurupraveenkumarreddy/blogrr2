import React, { Component } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import Navbar from "../Navbar";
import { withRouter } from "../../utils/withRouter";
import './profile.css';

class Profile extends Component {
  state = {
    profile: null,
    posts: [],
    loading: true,
    error: null,
    followers: 0,
    following: 0,
    Jtoken: "",
    currentUserId: null, // New: stores logged-in user's ID
    createForm: {
      displayName: "",
      handle: "",
      avatarUrl: "",
      bio: ""
    },
    editing: false,
    editPostId: null,
    editPostForm: {
      title: "",
      content: "",
      image_url: "",
    },
  };

  componentDidMount() {
    // Get current logged-in user from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      this.setState({ currentUserId: parsedUser.id }, this.loadData);
    } else {
      this.setState({ loading: false, error: "User not logged in" });
    }
  }

  loadData = async () => {
    const { userId } = this.props.params;
    const { currentUserId } = this.state;

    // Restrict access if viewing another user's profile
    if (parseInt(userId, 10) !== currentUserId) {
      this.setState({ loading: false, error: "Not allowed to view this profile" });
      return;
    }

    const Jtoken = Cookies.get("jwt_token");
    this.setState({ Jtoken });

    try {
      const profRes = await fetch(`/api/profiles/${userId}`);
      if (profRes.ok) {
        const profile = await profRes.json();
        const postsRes = await fetch("/api/posts");
        const allPosts = await postsRes.json();
        const posts = allPosts.filter((p) => p.author_id === parseInt(userId));

        const folRes = await fetch(`/api/follows/count/followers/${userId}`);
        const { followers } = await folRes.json();

        const follRes = await fetch(`/api/follows/count/following/${userId}`);
        const { following } = await follRes.json();

        this.setState({
          profile,
          posts,
          followers,
          following,
          loading: false,
          createForm: {
            displayName: profile.displayName,
            handle: profile.handle,
            avatarUrl: profile.avatarUrl,
            bio: profile.bio
          }
        });
      } else {
        this.setState({ profile: null, loading: false });
      }
    } catch (err) {
      this.setState({ error: err.message, loading: false });
    }
  };

  handleChange = (e) => {
    this.setState({
      createForm: {
        ...this.state.createForm,
        [e.target.name]: e.target.value
      }
    });
  };

  handleCreateProfile = async () => {
    const { userId } = this.props.params;
    const { Jtoken, createForm } = this.state;
    const { displayName, handle, avatarUrl, bio } = createForm;
    try {
      const res = await fetch("/api/profiles/secure/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Jtoken}`
        },
        body: JSON.stringify({
          userId: parseInt(userId, 10),
          displayName,
          handle,
          avatarUrl,
          bio
        })
      });

      if (res.ok) {
        alert("Profile created!");
        this.loadData();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to create profile");
      }
    } catch (err) {
      alert("Server error: " + err.message);
    }
  };

  handleUpdateProfile = async () => {
    const { userId } = this.props.params;
    const { displayName, handle, avatarUrl, bio } = this.state.createForm;
    const { Jtoken } = this.state;
    try {
      const res = await fetch(`/api/profiles/secure/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${Jtoken}` },
        body: JSON.stringify({
          displayName,
          handle,
          avatarUrl,
          bio
        })
      });

      if (res.ok) {
        alert("Profile updated!");
        this.setState({ editing: false });
        this.loadData();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update profile");
      }
    } catch (err) {
      alert("Server error: " + err.message);
    }
  };

  handleDeleteProfile = async () => {
    const { userId } = this.props.params;
    const { Jtoken } = this.state;
    const confirm = window.confirm("Are you sure you want to delete your profile?");
    if (!confirm) return;

    try {
      const res = await fetch(`/api/profiles/secure/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Jtoken}`,
        }
      });

      if (res.ok) {
        alert("Profile deleted!");
        this.setState({ profile: null });
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete profile");
      }
    } catch (err) {
      alert("Server error: " + err.message);
    }
  };

  handleDeletePost = async (postId) => {
    const { Jtoken } = this.state;
    const confirm = window.confirm("Are you sure you want to delete this post?");
    if (!confirm) return;

    try {
      const res = await fetch(`/api/posts/secure/${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Jtoken}`,
        }
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Post deleted");
        this.setState((prevState) => ({
          posts: prevState.posts.filter((post) => post.id !== postId)
        }));
      } else {
        alert(data.error || "Failed to delete post");
      }
    } catch (err) {
      alert("Error deleting post: " + err.message);
    }
  };

  handleEditClick = (post) => {
    this.setState({
      editPostId: post.id,
      editPostForm: {
        title: post.title,
        content: post.content,
        image_url: post.image_url || ""
      }
    });
  };

  handleEditPostChange = (e) => {
    this.setState({
      editPostForm: {
        ...this.state.editPostForm,
        [e.target.name]: e.target.value
      }
    });
  };

  handleUpdatePost = async () => {
    const { editPostId, editPostForm, Jtoken } = this.state;

    try {
      const res = await fetch(`/api/posts/secure/${editPostId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${Jtoken}` },
        body: JSON.stringify({
          ...editPostForm,
          category_id: 1,
          author_id: this.state.profile.userId
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert("Post updated");
        this.setState({ editPostId: null });
        this.loadData();
      } else {
        alert(data.error || "Failed to update post");
      }
    } catch (err) {
      alert("Error updating post: " + err.message);
    }
  };
  
  renderEditForm = () => {
    const { displayName, handle, avatarUrl, bio } = this.state.createForm;
    return (
      <div className="profile-form">
        <h2 className="form-title">Edit Profile</h2>
        <div className="form-group">
          <label className="form-label">Display Name</label>
          <input 
            type="text" 
            name="displayName" 
            value={displayName} 
            onChange={this.handleChange} 
            className="form-input"
            required 
          />
        </div>
        <div className="form-group">
          <label className="form-label">Handle</label>
          <input 
            type="text" 
            name="handle" 
            value={handle} 
            onChange={this.handleChange} 
            className="form-input"
            required 
          />
        </div>
        <div className="form-group">
          <label className="form-label">Avatar URL</label>
          <input 
            type="text" 
            name="avatarUrl" 
            value={avatarUrl} 
            onChange={this.handleChange} 
            className="form-input"
            placeholder="(optional)"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Bio</label>
          <textarea 
            name="bio" 
            value={bio} 
            onChange={this.handleChange} 
            className="form-textarea"
            rows={4}
          ></textarea>
        </div>
        <div className="form-actions">
          <button 
            onClick={this.handleUpdateProfile}
            className="form-button primary"
          >
            <i className="fas fa-save"></i> Update Profile
          </button>
          <button 
            onClick={() => this.setState({ editing: false })}
            className="form-button secondary"
          >
            <i className="fas fa-times"></i> Cancel
          </button>
        </div>
      </div>
    );
  };

  renderCreateForm = () => {
    const { displayName, handle, avatarUrl, bio } = this.state.createForm;
    return (
      <div className="profile-form">
        <h2 className="form-title">Create Your Profile</h2>
        <div className="form-group">
          <label className="form-label">Display Name</label>
          <input 
            type="text" 
            name="displayName" 
            placeholder="Your public name" 
            value={displayName} 
            onChange={this.handleChange} 
            className="form-input"
            required 
          />
        </div>
        <div className="form-group">
          <label className="form-label">Handle</label>
          <input 
            type="text" 
            name="handle" 
            placeholder="Your username" 
            value={handle} 
            onChange={this.handleChange} 
            className="form-input"
            required 
          />
        </div>
        <div className="form-group">
          <label className="form-label">Avatar URL</label>
          <input 
            type="text" 
            name="avatarUrl" 
            placeholder="(optional)" 
            value={avatarUrl} 
            onChange={this.handleChange} 
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Bio</label>
          <textarea 
            name="bio" 
            placeholder="Tell us about yourself" 
            value={bio} 
            onChange={this.handleChange} 
            className="form-textarea"
            rows={4}
          ></textarea>
        </div>
        <button 
          onClick={this.handleCreateProfile}
          className="form-button primary"
        >
          <i className="fas fa-user-plus"></i> Create Profile
        </button>
      </div>
    );
  };

  renderPostEditForm = (post) => {
    return (
      <div className="post-edit-form">
        <div className="form-group">
          <label className="form-label">Title</label>
          <input
            type="text"
            name="title"
            value={this.state.editPostForm.title}
            onChange={this.handleEditPostChange}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Content</label>
          <textarea
            name="content"
            value={this.state.editPostForm.content}
            onChange={this.handleEditPostChange}
            className="form-textarea"
            rows={6}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Image URL</label>
          <input
            type="text"
            name="image_url"
            value={this.state.editPostForm.image_url}
            onChange={this.handleEditPostChange}
            className="form-input"
            placeholder="(optional)"
          />
        </div>
        <div className="form-actions">
          <button 
            onClick={this.handleUpdatePost} 
            className="form-button primary"
          >
            <i className="fas fa-save"></i> Update Post
          </button>
          <button 
            onClick={() => this.setState({ editPostId: null })}
            className="form-button secondary"
          >
            <i className="fas fa-times"></i> Cancel
          </button>
        </div>
      </div>
    );
  };

  render() {
    const { profile, posts, loading, error, followers, following, editing } = this.state;

    if (loading) return (
      <>
        <Navbar />
        <div className="profile-loading">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </>
    );

    if (error === "Not allowed to view this profile") {
      return (
        <>
          <Navbar />
          <div className="profile-error">
            <i className="fas fa-exclamation-triangle"></i>
            <p>You are not allowed to view this profile.</p>
          </div>
        </>
      );
    }

    if (error) return (
      <>
        <Navbar />
        <div className="profile-error">
          <i className="fas fa-exclamation-circle"></i>
          <p>{error}</p>
        </div>
      </>
    );

    if (!profile) {
      return (
        <>
          <Navbar />
          <div className="profile-container">
            {this.renderCreateForm()}
          </div>
        </>
      );
    }

    return (
      <>
        <Navbar />
        <div className="profile-page">
          <div className="profile-container">
            {/* Sidebar */}
            <div className="profile-sidebar">
              <div className="profile-avatar">
                <img
                  src={profile.avatarUrl || "N:\\7th sem\\summer_internship\\project resources\\blank profile.jpg"}
                  alt={profile.displayName}
                  className="avatar-image"
                />
              </div>
              <h1 className="profile-name">{profile.displayName}</h1>
              <p className="profile-handle">@{profile.handle}</p>

              <div className="profile-stats">
                <div className="stat-item">
                  <span className="stat-number">{posts.length}</span>
                  <span className="stat-label">Posts</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{followers}</span>
                  <span className="stat-label">Followers</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{following}</span>
                  <span className="stat-label">Following</span>
                </div>
              </div>

              <nav className="profile-menu">
                <button 
                  className="menu-item active"
                  onClick={() => this.setState({ editing: false })}
                >
                  <i className="fas fa-user"></i> Overview
                </button>
                <button 
                  className="menu-item"
                  onClick={() => this.setState({ editing: true })}
                >
                  <i className="fas fa-edit"></i> Edit Profile
                </button>
                <button 
                  className="menu-item danger"
                  onClick={this.handleDeleteProfile}
                >
                  <i className="fas fa-trash-alt"></i> Delete Profile
                </button>
              </nav>
            </div>

            {/* Main Content */}
            <div className="profile-content">
              {editing ? (
                this.renderEditForm()
              ) : (
                <>
                  <section className="profile-section">
                    <h2 className="section-title">
                      <i className="fas fa-info-circle"></i> About
                    </h2>
                    <p className="profile-bio">
                      {profile.bio || "No bio provided yet."}
                    </p>
                  </section>

                  <section className="profile-section">
                    <h2 className="section-title">
                      <i className="fas fa-newspaper"></i> Posts
                    </h2>
                    {posts.length === 0 ? (
                      <p className="no-posts">You haven't created any posts yet.</p>
                    ) : (
                      <div className="posts-grid">
                        {posts.map((post) => {
                          const isEditing = this.state.editPostId === post.id;
                          return (
                            <article 
                              key={post.id} 
                              className={`post-card ${isEditing ? "editing" : ""}`}
                            >
                              {isEditing ? (
                                this.renderPostEditForm(post)
                              ) : (
                                <>
                                  {post.image_url && (
                                    <div className="post-image">
                                      <img 
                                        src={post.image_url} 
                                        alt={post.title} 
                                      />
                                    </div>
                                  )}
                                  <div className="post-content">
                                    <h3 className="post-title">{post.title}</h3>
                                    <p className="post-excerpt">
                                      {post.content.slice(0, 150)}
                                      {post.content.length > 150 ? "..." : ""}
                                    </p>
                                    <div className="post-actions">
                                      <button 
                                        className="action-button edit"
                                        onClick={() => this.handleEditClick(post)}
                                      >
                                        <i className="fas fa-edit"></i> Edit
                                      </button>
                                      <button 
                                        className="action-button delete"
                                        onClick={() => this.handleDeletePost(post.id)}
                                      >
                                        <i className="fas fa-trash-alt"></i> Delete
                                      </button>
                                    </div>
                                  </div>
                                </>
                              )}
                            </article>
                          );
                        })}
                      </div>
                    )}
                  </section>
                </>
              )}
            </div>
          </div>
        </div>
      </>
    );}
}

export default withRouter(Profile);
