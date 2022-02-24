//jshint esversion:6

const express = require("express");
const ejs = require("ejs");
const mongoose = require('mongoose');
const { send } = require("express/lib/response");

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

////////// Requests Targetting all Articles //////////
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

////////// Requests Targetting A Specific Article //////////

app.route("/articles/:articleTitle")

.get(function(req, res){
    //GET > Fetches THE specific article 
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
        if(foundArticle){
            res.send(foundArticle);
        } else {
            res.send("No articles matching that title was found.");
        }
    });
})

.put(function(req, res){
    //PUT > Updates THE specific article
    Article.replaceOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        function(err){
            if(!err){
                res.send("Successfully update the article.");
            } else {
                res.send(err);
            }
        }
        );
})

.patch(function(req, res){
    //PATCH > Updates THE specific article
    //(Only the fields that we provide data for)
    Article.updateOne(
        {title: req.params.articleTitle},
        //Set all the data for the fields that should be updated.
        {$set: req.body},
        function(err){
            if(!err){
                res.send("Successfully update the article.");
            } else {
                res.send(err);
            }
        }
    );
})

.delete(function(req, res){
    //DELETE > Deletes THE specific article
    Article.deleteOne(
        {title: req.params.articleTitle},
        function(err){
            if(!err){
                res.send("Successfully deleted the corresponding article.");
            } else {
                res.send(err);
            }
        }
    );
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});