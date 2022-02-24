//jshint esversion:6

const express = require("express");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();


app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = new mongoose.Schema ({
    title: String,
    content: String
});

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")

.get(function(req, res){
    //GET > Fetches ALL the articles
    Article.find(function(err, foundArticles){
        if(!err){
            res.send(foundArticles);
        } else {
            res.send(err);
        }
    });
})

.post(function(req, res){
    //POST > Creates ONE new article
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save(function(err){
        if(!err){
            res.send("Successfully added a new article.");
        } else {
            res.send(err);
        }
    });
})

.delete(function(req, res){
    //DELETE > Deletes ALL the articles
    Article.deleteMany(function(err){
        if(!err){
            res.send("Successfully deleted all articles.");
        } else {
            res.send(err);
        }
    });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});