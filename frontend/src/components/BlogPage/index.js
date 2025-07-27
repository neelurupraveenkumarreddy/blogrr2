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
    user: null
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
      const res = await fetch(`http://localhost:8080/api/posts/${id}`);
      if (!res.ok) throw new Error("Failed to fetch blog post");
      const post = await res.json();

      let authorName = "Unknown Author";
      if (post.author_id) {
        const authorRes = await fetch(`http://localhost:8080/api/profiles/${post.author_id}`);
        if (authorRes.ok) {
          const authorProfile = await authorRes.json();
          authorName = authorProfile.displayName || "Unknown Author";
        }
      }

      const tagNames = await this.fetchTags(post.id);

      this.setState({
        title: post.title,
        category: post.category_id?.name || "Uncategorized",
        author: authorName,
        date: new Date(post.created_at).toLocaleDateString(),
        content: post.content.split("\n"),
        tags: tagNames,
        imageUrl: post.image_url
      });

      this.fetchComments();
      this.fetchLikeStatus();
      this.fetchLikeCount();
    } catch (err) {
      console.error(err);
      alert("Unable to load blog post.");
    }
  };

  fetchTags = async (postId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/tags/post/${postId}`);
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
      const res = await fetch(`http://localhost:8080/api/comments/post/${id}`);
      const comments = await res.json();

      const userMapRes = await fetch("http://localhost:8080/api/users/usernames");
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
        `http://localhost:8080/api/likes/user-liked?userId=${user.id}&postId=${id}`
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
      const res = await fetch(`http://localhost:8080/api/likes/count/${id}`);
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
      ? `http://localhost:8080/api/likes/remove?userId=${user.id}&postId=${id}`
      : "http://localhost:8080/api/likes/add";

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
      const res = await fetch("http://localhost:8080/api/comments/secure/create", {
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

  render() {
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
    return (
      <div className="blog-m">
        <Navbar />
        <div className="blog-container">
          <div className="blog-header">
            <h1 className="blog-title">{title}</h1>

            <div className="blog-tags">
              {tags.map((tag, index) => (
                <span key={index} className="blog-tag">{tag}</span>
              ))}
            </div>

            <p className="blog-meta">By {author} · Published on {date}</p>
            <img src={imageUrl} alt="Blog Header" className="blog-image" />
          </div>

          <div className="blog-content">
            {content.map((para, index) => (
              <ReactMarkdown key={index} >{para}</ReactMarkdown>
            ))}
          </div>

          <div className="blog-reactions">
            <span
              className={`blog-like ${likedByUser ? "liked" : ""}`}
              onClick={this.toggleLike}
              style={{ cursor: "pointer" }}
            >
              ❤️ {likes}
            </span>
            <span className="blog-comment-count">💬 {comments.length}</span>
          </div>

          <div className="blog-comments">
            <h3>Comments</h3>
            {comments.map((c, i) => (
              <div key={i} className="comment">
                <p className="comment-author">
                  {c.username || "User"}{" "}
                  <span className="comment-time">{c.created_at || ""}</span>
                </p>
                <p>{c.comment_text}</p>
              </div>
            ))}

            {user && (
              <div className="comment-form">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={this.handleCommentChange}
                />
                <button onClick={this.handleCommentPost}>Post</button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(BlogPage);
