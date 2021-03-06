var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Blog = mongoose.model('Blog');
var Comment = mongoose.model('Comment');

/* GET home page. */
router.get('/', function(req, res, next) {
  Blog.find(function(err, post) {
    if (err) {
      res.render('index', {message:'error retrieving posts from database'});
    } else {
      res.render('index', {post:post.reverse()});  
    }
  })
});

router.get('/admin', function(req, res) {
  res.render('add-post');
});

router.post('/admin', function(req, res) {
  var tags = (req.body.tags).split(',');
  console.log(tags);
  new Blog({
    title:req.body.title,
    image:req.body.image,
    body:req.body.body,
    author:req.body.author,
    tags:tags
  }).save(function(err, post) {
    if (err) {
      res.render('add-post', {message:'There was an error when saving post to database'});
    } else {
      res.render('add-post', {message:'successfully added!'});
    }
  });
});

router.get('/posts/:slug', function(req, res) {
  var slug = req.params.slug;
  Blog.findOne({'slug':slug}, function(err, post) {
    res.render('blog-post', {post:post});
  });
});

router.post('/admin/comments/add', function(req, res) {
  Blog.findOne({'title':req.body.title}, function(err, post) {
    var comment = new Comment({
      comment:req.body.comment,
      user:req.body.user
    });
    post.comments.push(comment);
    post.save(function(err, post) {
      console.log(err, post);
    });
  });
});

router.get('/admin/comments', function(req, res) {
  Blog.findOne({'title':req.query.title}, function(err, post) {
    res.json(post.comments.map(function(ele) {
      return {
        "comment":ele.comment,
        "user":ele.user
      }
    }));
  });
});

router.get('/tags/:searchtag', function(req, res) {
  console.log(req.params.searchtag);
  Blog.find(function(err, posts) {
    var newPosts = posts.filter(function(ele) {
      console.log('searching for ', req.params.searchtag);
      console.log('tags ', ele.tags); 
      console.log(ele.tags.indexOf(req.params.searchtag));
      if (ele.tags.indexOf(req.params.searchtag) >= 0) {
        return true;
      } else {
        return false;
      }
    });
    res.render('index', {post:newPosts.reverse(), filter:req.params.searchtag});
  });  
});

router.get('/authors/:author', function(req, res) {
  Blog.find({'author':req.params.author}, function(err, post) {
    res.render('index', {post:post.reverse(), author:req.params.author});
  });
});

module.exports = router;
