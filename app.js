const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Temporary server-side storage. Posts reset when the server restarts.
let posts = [];
let nextId = 1;

const categories = ["Tech", "Lifestyle", "Education", "Business", "Personal"];

// Middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Home page: show create form and all posts
app.get("/", (req, res) => {
  const selectedCategory = req.query.category || "All";

  const filteredPosts =
    selectedCategory === "All"
      ? posts
      : posts.filter((post) => post.category === selectedCategory);

  res.render("index", {
    posts: filteredPosts,
    categories,
    selectedCategory
  });
});

// Create a new blog post
app.post("/posts", (req, res) => {
  const { creator, title, content, category } = req.body;

  if (!creator || !title || !content || !category) {
    return res.redirect("/");
  }

  const newPost = {
    id: nextId++,
    creator,
    title,
    content,
    category,
    createdAt: new Date().toLocaleString()
  };

  posts.unshift(newPost);
  res.redirect("/");
});

// Show edit form
app.get("/posts/:id/edit", (req, res) => {
  const postId = Number(req.params.id);
  const post = posts.find((item) => item.id === postId);

  if (!post) {
    return res.status(404).send("Post not found");
  }

  res.render("edit", {
    post,
    categories
  });
});

// Save edited post
app.post("/posts/:id/edit", (req, res) => {
  const postId = Number(req.params.id);
  const { creator, title, content, category } = req.body;

  const post = posts.find((item) => item.id === postId);

  if (!post) {
    return res.status(404).send("Post not found");
  }

  post.creator = creator;
  post.title = title;
  post.content = content;
  post.category = category;

  res.redirect("/");
});

// Delete post
app.post("/posts/:id/delete", (req, res) => {
  const postId = Number(req.params.id);
  posts = posts.filter((item) => item.id !== postId);
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Blog app is running at http://localhost:${PORT}`);
});
