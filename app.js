//jshint esversion:6
// IMPORT ////
const express = require("express");
const mongoose = require("mongoose")
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash")

const homeStartingContent = "This is the home page for the Daily Journal Entries, you can compose posts under the blog, you can also read more by clicking the read more beside each blog. If you want to compose a new entry please clic on the compose button"
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

// SETUP ////
mongoose.set("strictQuery",false)
mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true}, ()=>{
    console.log("Connected to MongoDB ")
})
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Schema Setup ///
const postSchema = new mongoose.Schema({
  title: {type: String, required: [true, "Title not found!"]},
  content: String
})

const Post = mongoose.model("Post", postSchema)




// GET ////
app.get("/", function(req, res){
  Post.find({}, function(err, posts){
    res.render("home", {homeStartingContent: homeStartingContent, postArray: posts})
  })
})

app.get("/about", function(req, res){
  res.render("about", {pageTitle: "About", pageContent: aboutContent})
})

app.get("/contact", function(req, res){
  res.render("about", {pageTitle: "Contact", pageContent: contactContent})
})

app.get("/compose", function(req, res){
  res.render("compose", {pageTitle: "Compose"})
})

app.get("/posts/:postId", function(req, res){
  const requestPostId = req.params.postId
  Post.findOne({_id: requestPostId}, function(err, post){
    if (!err) {
      res.render("post", {pageTitle: post.title, pageContent: post.content})
    }
  })
})

// POST ////
app.post("/compose", function(req, res){
  const post = new Post ({
    title: req.body.postTitle,
    content: req.body.postBlog
  })
  post.save(function(err){
    if (!err){
      res.redirect("/")
    } else {
      res.send("Entry Fail, please fill all the info!")
    }
  })
})






// LISTEN ////
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
