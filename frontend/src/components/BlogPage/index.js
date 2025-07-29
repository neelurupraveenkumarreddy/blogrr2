import { Component } from "react";
import Cookies from 'js-cookie'
import Navbar from "../Navbar";
import { withRouter } from "../../utils/withRouter";
import "./page.css";
import ReactMarkdown from "react-markdown";


class BlogPage extends Component {
  state = {
    title: "",
    category: "",
    author: "",
    date: "",
    content: [],
    Jtoken:"",
    tags: [],
    likes: 0,
    comments: [],
    newComment: "",
    imageUrl: "",
    likedByUser: false,
    user: null,
    fetchState:"inpro",
  };

  componentDidMount() {
    const jwtToken = Cookies.get("jwt_token");
    if (jwtToken) {
      const user = JSON.parse(localStorage.getItem("user"));
      this.setState({ user,Jtoken:jwtToken }, () => {
        this.fetchBlogPost();
      });
    } else {
      this.fetchBlogPost(); // load blog post even if not logged in
    }
  }

  fetchBlogPost = async () => {
    const { id } = this.props.params;
    try {
      const res = await fetch(`/api/posts/${id}`);
      if (!res.ok) throw new Error("Failed to fetch blog post");
      const post = await res.json();
      let authorName = "Unknown Author";
      if (post.author_id) {
        const authorRes = await fetch(`/api/profiles/${post.author_id}`);
        if (authorRes.ok) {
          const authorProfile = await authorRes.json();
          authorName = authorProfile.displayName || "Unknown Author";
        }
      }

      const tagNames = await this.fetchTags(post.id);
      this.fetchComments();
      this.fetchLikeStatus();
      this.fetchLikeCount();
      this.setState({
        title: post.title,
        category: post.categoryName || "Uncategorized",
        author: authorName,
        date: new Date(post.created_at).toLocaleDateString(),
        content: post.content.split("\n"),
        tags: tagNames,
        imageUrl: post.image_url,
        fetchState:"suc",
      });

    } catch (err) {
      console.error(err);
      this.setState({fetchState:"fail"});
      alert("Unable to load blog post.");
    }
  };

  fetchTags = async (postId) => {
    try {
      const res = await fetch(`/api/tags/post/${postId}`);
      if (!res.ok) throw new Error("Failed to fetch tags");
      const tagList = await res.json();
      return tagList.map(tag => tag.name);
    } catch (err) {
      console.error("Error fetching tags:", err);
      return [];
    }
  };

  fetchComments = async () => {
    const { id } = this.props.params;
    try {
      const res = await fetch(`/api/comments/post/${id}`);
      const comments = await res.json();

      const userMapRes = await fetch("/api/users/usernames");
      const userMap = await userMapRes.json();

      const enrichedComments = comments.map((comment) => ({
        ...comment,
        username: userMap[comment.user_id] || "User"
      }));
      this.setState({ comments: enrichedComments });
    } catch (err) {
      console.error("Error fetching comments with usernames:", err);
    }
  };

  fetchLikeStatus = async () => {
    const { id } = this.props.params;
    const { user } = this.state;
    try {
      const res = await fetch(
        `/api/likes/user-liked?userId=${user.id}&postId=${id}`
      );
      const data = await res.json();
      this.setState({ likedByUser: data.liked });
    } catch (err) {
      console.error("Error fetching like status:", err);
    }
  };

  fetchLikeCount = async () => {
    const { id } = this.props.params;
    try {
      const res = await fetch(`/api/likes/count/${id}`);
      const data = await res.json();
      this.setState({ likes: data.likeCount });
    } catch (err) {
      console.error("Error fetching like count:", err);
    }
  };

  toggleLike = async () => {
    const { likedByUser, user } = this.state;
    const { id } = this.props.params;

    if (!user) {
      alert("Please log in to like the post.");
      return;
    }

    const url = likedByUser
      ? `/api/likes/remove?userId=${user.id}&postId=${id}`
      : "/api/likes/add";

    const options = likedByUser
      ? { method: "DELETE" }
      : {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: user.id, post_id: parseInt(id) })
        };

    try {
      const res = await fetch(url, options);
      const result = await res.json();
      this.fetchLikeStatus();
      this.fetchLikeCount();
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  handleCommentChange = (e) => {
    this.setState({ newComment: e.target.value });
  };

  handleCommentPost = async () => {
    const { newComment, user ,Jtoken} = this.state;
    const { id } = this.props.params;
    if (!user) {
      alert("Please log in to comment.");
      return;
    }

    if (newComment.trim() === "") return;

    const commentData = {
      user_id: user.id,
      post_id: parseInt(id),
      comment_text: newComment,
      username: user.username
    };

    try {
      const res = await fetch("/api/comments/secure/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" ,Authorization: `Bearer ${Jtoken}`},
        body: JSON.stringify(commentData)
      });
      const data = await res.json();
      this.setState({ newComment: "" });
      this.fetchComments();
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };
  fetchStateAction=()=>{
    const {fetchState}=this.state
    switch (fetchState){
      case "inpro":
        return this.loadingScreen()
      case "fail":
        return this.failureScreen()
      case "suc":
        return this.successScreen()
      default:
        return <></>;
    }
  }
  loadingScreen=()=>(
    <div className="admin-loading">
            <div className="loading-spinner"></div>
            <p>Loading Blog...</p>
          </div>)
  failureScreen=()=>(
    <><h1>Unable to fetch the blog...Please Try again later...</h1>
  </>)
  successScreen=()=>{
       const {
      title,
      author,
      date,
      category,
      content,
      tags,
      likes,
      comments,
      newComment,
      imageUrl,
      likedByUser,
      user
    } = this.state;
    return (<div className="blog-container">
          {/* Article Header */}
          <div className="blog-header">
            <div className="blog-meta-container">
              <span className="blog-category">{category}</span>
              <span className="blog-date">{date}</span>
            </div>
            
            <h1 className="blog-title">{title}</h1>
            
            <div className="blog-author-container">
              <span className="blog-by">By</span>
              <span className="blog-author">{author}</span>
            </div>

            {imageUrl && (
              <div className="blog-image-container">
                <img src={imageUrl} alt="Blog Header" className="blog-image" />
              </div>
            )}

            {tags.length > 0 && (
              <div className="blog-tags">
                {tags.map((tag, index) => (
                  <span key={index} className="blog-tag">{tag}</span>
                ))}
              </div>
            )}
          </div>

          {/* Article Content */}
          <div className="blog-content">
            {content.map((para, index) => (
              <ReactMarkdown key={index}>{para}</ReactMarkdown>
            ))}
          </div>

          {/* Reactions */}
          <div className="blog-reactions">
            <button 
              className={`blog-like ${likedByUser ? "liked" : ""}`}
              onClick={this.toggleLike}
            >
              <i className={`fas fa-heart${likedByUser ? "" : "-broken"}`}></i>
              <span className="like-count">{likes}</span>
            </button>
            <span className="blog-comment-count">
              <i className="fas fa-comment"></i> {comments.length}
            </span>
          </div>

          {/* Comments Section */}
          <div className="blog-comments-section">
            <h3 className="comments-title">
              <i className="fas fa-comments"></i> Comments
            </h3>
            
            {comments.length > 0 ? (
              <div className="comments-list">
                {comments.map((c, i) => (
                  <div key={i} className="comment">
                    <div className="comment-header">
                      <span className="comment-author">{c.username || "User"}</span>
                      <span className="comment-time">{new Date(c.created_at).toLocaleString()}</span>
                    </div>
                    <div className="comment-body">
                      <p>{c.comment_text}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-comments">No comments yet. Be the first to comment!</p>
            )}

            {user && (
              <div className="comment-form">
                <div className="form-group">
                  <textarea
                    placeholder="Share your thoughts..."
                    value={newComment}
                    onChange={this.handleCommentChange}
                    rows="3"
                  />
                </div>
                <button 
                  className="comment-submit"
                  onClick={this.handleCommentPost}
                  disabled={!newComment.trim()}
                >
                  Post Comment
                </button>
              </div>
            )}
          </div>
        </div>)
  }
  render() {
    return (
      <div className="blog-page">
        <Navbar />
        {this.fetchStateAction()}
      </div>
    );
  }
}

export default withRouter(BlogPage);
