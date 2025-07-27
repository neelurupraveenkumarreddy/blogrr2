// src/pages/UploadBlog.js
import { Component } from "react";
import Cookies from "js-cookie";
import ReactMarkdown from "react-markdown";
import Navbar from "../Navbar";
import "./upload.css";

class Upload extends Component {
  state = {
    title: "",
    content: "",
    category: "",
    categories: [],
    tagInput: "",
    availableTags: [],
    tagList: [],
    featuredImage: null,
    previewImage: null // for live image preview
  };

  componentDidMount() {
    this.getCategories();
     this.getAvailableTags();
  }

  getAvailableTags = async () => {
  try {
    const response = await fetch("http://localhost:8080/api/tags");
    if (!response.ok) {
      throw new Error("Failed to fetch tags");
    }
    const data = await response.json();
    this.setState({ availableTags: data.map(tag => tag.name) });
  } catch (error) {
    console.error("Error fetching tags:", error);
  }
};
  getCategories = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/categories");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      this.setState({ categories: data });
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleFileChange = (e) => {
    const file = e.target.files[0];
    this.setState({
      featuredImage: file,
      previewImage: file ? URL.createObjectURL(file) : null
    });
  };

  handleTagInputChange = (e) => {
    this.setState({ tagInput: e.target.value });
  };

  handleTagKeyDown = (e) => {
    const { tagInput, tagList } = this.state;
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!tagList.includes(newTag)) {
        this.setState({
          tagList: [...tagList, newTag],
          tagInput: ""
        });
      } else {
        this.setState({ tagInput: "" });
      }
    }
  };

  removeTag = (index) => {
    const tagList = [...this.state.tagList];
    tagList.splice(index, 1);
    this.setState({ tagList });
  };

  addMarkdown = (syntax) => {
    this.setState((prev) => ({
      content: prev.content + syntax
    }));
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const Jtoken=Cookies.get("jwt_token");
    const { title, content, category, tagList, featuredImage } = this.state;
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      let imageUrl =
        "https://res.cloudinary.com/dsixdalgl/image/upload/v1751453691/blog_images/mq4xv2eydvjwz3zshsiy.png";

      // Step 1: Upload image
      if (featuredImage) {
        const imageFormData = new FormData();
        imageFormData.append("image", featuredImage);
        const imageUploadResponse = await fetch(
          "http://localhost:8080/api/images/upload",
          {
            method: "POST",
            body: imageFormData
          }
        );
        if (!imageUploadResponse.ok) {
          throw new Error("Image upload failed");
        }
        const imageUploadResult = await imageUploadResponse.json();
        imageUrl = imageUploadResult.url;
      }

      // Step 2: Create blog post
      const blogData = {
        title,
        content,
        category_id: parseInt(category),
        image_url: imageUrl,
        author_id: user.id
      };

      const response = await fetch("http://localhost:8080/api/posts/secure/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Jtoken}`,
        },
        body: JSON.stringify(blogData)
      });

      if (!response.ok) {
        throw new Error("Failed to upload blog post.");
      }

      const result = await response.json();
      const postId = result.postId || result.id;

      // Step 3: Handle tags
      if (tagList.length > 0 && postId) {
        await fetch(
          `http://localhost:8080/api/tags/create-or-assign?postId=${postId}`,
          {
            method: "POST",
            headers: {
    "Content-Type": "application/json"
  },
            body: JSON.stringify(tagList)
          }
        );
      }

      alert("Blog uploaded successfully!");

      this.setState({
        title: "",
        content: "",
        category: "",
        tagList: [],
        tagInput: "",
        featuredImage: null,
        previewImage: null
      });
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    }
  };

  render() {
    return (
      <>
        <Navbar />
        <div className="upload-container">
          {/* LEFT SIDE */}
          <div className="upload-left">
            <h2 className="upload-title">Create a Blog Post</h2>
            <form className="upload-form" onSubmit={this.handleSubmit}>
              {/* Title */}
              <input
                type="text"
                name="title"
                placeholder="Title"
                className="upload-input"
                value={this.state.title}
                onChange={this.handleChange}
                required
              />

              {/* Category Dropdown */}
              <select
                name="category"
                className="upload-input"
                value={this.state.category}
                onChange={this.handleChange}
                required
              >
                <option value="">Select category</option>
                {this.state.categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              {/* Tags */}
              <div className="upload-tag-container">
                <label className="upload-label">Tags</label>
                <div className="tag-input-wrapper">
                  {this.state.tagList.map((tag, index) => (
                    <span className="tag-pill" key={index}>
                      {tag}
                      <button
                        type="button"
                        className="tag-remove"
                        onClick={() => this.removeTag(index)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder="Type and press enter"
                    value={this.state.tagInput}
                    onChange={this.handleTagInputChange}
                    onKeyDown={this.handleTagKeyDown}
                    className="upload-tag-input"
                  />
                </div>
                  <div className="available-tags">
    {this.state.availableTags.map((tag, index) => (
      <span
        key={index}
        className={`available-tag ${
          this.state.tagList.includes(tag) ? "disabled" : ""
        }`}
        onClick={() => {
          if (!this.state.tagList.includes(tag)) {
            this.setState((prev) => ({
              tagList: [...prev.tagList, tag]
            }));
          }
        }}
      >
        {tag}
      </span>
    ))}
  </div>
              </div>

              {/* Featured Image Upload */}
              <div className="upload-dropbox">
                <p className="upload-label">Upload featured image</p>
                <input
                  type="file"
                  onChange={this.handleFileChange}
                  className="upload-file-input"
                />
                {/* Live Image Preview */}
                {this.state.previewImage && (
                  <img
                    src={this.state.previewImage}
                    alt="Preview"
                    style={{
                      marginTop: "10px",
                      width: "100%",
                      maxHeight: "200px",
                      objectFit: "cover",
                      borderRadius: "8px"
                    }}
                  />
                )}
              </div>

              <button type="submit" className="upload-button">
                Upload
              </button>
            </form>
          </div>

          {/* RIGHT SIDE (Markdown Editor) */}
          <div className="upload-right">
            {/* Markdown Toolbar */}
            <div className="markdown-toolbar">
              <button type="button" onClick={() => this.addMarkdown("# ")}>
                H1
              </button>
              <button type="button" onClick={() => this.addMarkdown("## ")}>
                H2
              </button>
              <button type="button" onClick={() => this.addMarkdown("**bold**")}>
                B
              </button>
              <button type="button" onClick={() => this.addMarkdown("_italic_")}>
                I
              </button>
            </div>

            {/* Markdown Input */}
            <textarea
              className="markdown-editor"
              value={this.state.content}
              onChange={this.handleChange}
              name="content"
              placeholder="Write your markdown content here..."
            />

            {/* Live Markdown Preview */}
            <div className="markdown-preview">
              <ReactMarkdown>{this.state.content}</ReactMarkdown>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Upload;
