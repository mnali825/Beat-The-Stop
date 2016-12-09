var mongoose = require('mongoose'),
    URLSlugs = require('mongoose-url-slugs');

var CommentSchema = new mongoose.Schema({
  comment:String,
  user:String,
  date:{type:Date, default:Date.now()}
});

var BlogSchema = new mongoose.Schema({
  title:String,
  image:String,
  body:String,
  date: {type:Date, default:Date.now()},
  author: String,
  comments: [CommentSchema],
  tags:[String]
});

BlogSchema.plugin(URLSlugs('title'));

mongoose.model('Comment', CommentSchema);
mongoose.model('Blog', BlogSchema);

mongoose.connect('mongodb://localhost/blogspot');