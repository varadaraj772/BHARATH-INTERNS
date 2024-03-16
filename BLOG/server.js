const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
app.use(express.static(__dirname));
const PORT = process.env.PORT || 3000;

mongoose
  .connect("mongodb://localhost:27017/blog", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
});
const Post = mongoose.model("Post", postSchema); 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
// Get all posts
app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find(); 
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.post("/posts", async (req, res) => {
  try {
    const { title, content } = req.body;
    console.log("Received post data:", req.body); 
    const newPost = new Post({ title, content });
    console.log(newPost);
    
    await newPost.save();
    res.status(201).json(newPost); 
  } catch (error) {
    console.error("Error saving post:", error); 
    res.status(400).json({ error: error.message });
  }
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
