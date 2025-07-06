// src/pages/UploadBlog.js
import { Component } from "react";
import Navbar from "../Navbar";
import "./upload.css";

class Upload extends Component {
  state = {
    title: "",
    content: "",
    category: "", // will hold selected category id
    categories: [], // fetched category list
      tagInput: "",
  tagList: [],
    featuredImage: null
  };

  componentDidMount() {
    this.getCategories();
  }

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
    this.setState({ featuredImage: e.target.files[0] });
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

  handleSubmit = async (e) => {
  e.preventDefault();

  const { title, content, category, tagList, featuredImage } = this.state;

  try {
    let imageUrl = "https://res.cloudinary.com/dsixdalgl/image/upload/v1751453691/blog_images/mq4xv2eydvjwz3zshsiy.png";

    // Step 1: Upload image
    if (featuredImage) {
      const imageFormData = new FormData();
      imageFormData.append("image", featuredImage);
      const imageUploadResponse = await fetch("http://localhost:8080/api/images/upload", {
        method: "POST",
        body: imageFormData
      });
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
      author_id: 10
    };

    const response = await fetch("http://localhost:8080/api/posts/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(blogData)
    });

    if (!response.ok) {
      throw new Error("Failed to upload blog post.");
    }

    const result = await response.json();
    const postId = result.postId || result.id; // depending on your backend

    // Step 3: Handle tags (optional, only if provided)

    if (tagList.length > 0 && postId) {
      await fetch(`http://localhost:8080/api/tags/create-or-assign?postId=${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(tagList)
      });
    }

    alert("Blog uploaded successfully!");

    this.setState({
      title: "",
      content: "",
      category: "",
      tags: "",
      featuredImage: null
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
          <h2 className="upload-title">Create a Blog Post</h2>
          <form className="upload-form" onSubmit={this.handleSubmit}>
            <input
              type="text"
              name="title"
              placeholder="Title"
              className="upload-input"
              value={this.state.title}
              onChange={this.handleChange}
              required
            />

            <textarea
              name="content"
              placeholder="Content"
              className="upload-textarea"
              value={this.state.content}
              onChange={this.handleChange}
              required
            />

            {/* Updated Category Dropdown */}
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

            <div className="upload-tag-container">
  <label className="upload-label">Tags</label>
  <div className="tag-input-wrapper">
    {this.state.tagList.map((tag, index) => (
      <span className="tag-pill" key={index}>
        {tag}
        <button type="button" className="tag-remove" onClick={() => this.removeTag(index)}>×</button>
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
</div>


            <div className="upload-dropbox">
              <p className="upload-label">Upload featured image</p>
              <p className="upload-sub">Drag and drop, or click to select files</p>
              <input
                type="file"
                onChange={this.handleFileChange}
                className="upload-file-input"
                placeholder="image size should be less than 430 kb"
              />
            </div>

            <button type="submit" className="upload-button">
              Upload
            </button>
          </form>
        </div>
      </>
    );
  }
}

export default Upload;
