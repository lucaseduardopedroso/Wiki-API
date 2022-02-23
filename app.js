//jshint esversion:6

const express = require("express");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();


app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB")

const articleSchema = new mongoose.Schema ({
    title: String,
    content: String
})

const Article = mongoose.model("Article", articleSchema)

app.get("/articles", function(req, res){
    Article.find(function(err, foundArticles){
        if(!err){
            res.send(foundArticles);
        } else {
            res.send(err);
        }
    })
})
app.listen(3000, function() {
  console.log("Server started on port 3000");
});