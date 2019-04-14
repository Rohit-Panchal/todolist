var express = require("express"),
    methodOverride = require("method-override"),
    app     = express(),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    expressSanitizer = require("express-sanitizer");
  
// APP CONFIG     

mongoose.connect("mongodb://localhost:27017/restful_app_blog",{ useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());        
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));

//MONGOOSE MODEL CONFIG 
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body:  String,
    created: {type: Date, default: Date.now}
    
})

var Blog = mongoose.model("blog", blogSchema);

// Blog.create({
//     title: "Test Dog",
//     image: "https://images.pexels.com/photos/356378/pexels-photo-356378.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
//     body: "hello this is dog app"
// });

//RESTFUL ROUTES 

app.get("/", function(req, res){
    res.redirect("/blogs");
}); 

//INDEX ROUTE
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        } else {
            res.render("index", {blogs: blogs}); 
        }
    })
});

//NEW ROUTES

app.get("/blogs/new", function(req, res) {
    res.render("new")
});

// CREATE ROUTE 
app.post("/blogs", function(req, res){
    //create blogs

//to avoid any script tag line
    req.body.blog.body = req.sanitize(req.body.blog.body);
    
 
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        } else {
            //then, redirect to index 
            res.redirect("/blogs");
        }
    })
})

//SHOW ROUTE
app.get("/blogs/:id", function(req, res) {
    
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
            
        } else {
            res.render("show", {blog:foundBlog});
        }
    })
})


//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res) {
    
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundBlog});
        }
    })
    
});

//UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findOneAndReplace(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs" + req.params.id);
            
        } else {
            res.redirect(/blogs/)
        }
    })
})


//DELETE ROUTE

app.delete("/blogs/:id", function(req, res){
    //destroy blog
    Blog.findOneAndDelete(req.params.id, function(err, deletedBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    })
    // redirect somewhere
})




app.listen(process.env.PORT, process.env.IP, function(){
    console.log("SERVER STARTED!")
});