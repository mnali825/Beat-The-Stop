var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Goal = mongoose.model('Goal');

var username;

// User must first login to view page
router.get('/', function(req, res) {
  res.render('login');
});

router.post('/', function(req,res,next) {
  // NOTE: use the custom version of authenticate so that we can
  // react to the authentication result... and so that we can
  // propagate an error back to the frontend without using flash
  // messages
  passport.authenticate('local', function(err,user) {
    if(user) {
      // NOTE: using this version of authenticate requires us to
      // call login manually
      req.logIn(user, function(err) {
        username = user.username;
        res.redirect('/home');
      });
    } else {
      res.render('login', {message:'Your login or password is incorrect.'});
    }
  })(req, res, next);
  // NOTE: notice that this form of authenticate returns a function that
  // we call immediately! See custom callback section of docs:
  // http://passportjs.org/guide/authenticate/
});

router.get('/registration', function(req, res) {
  res.render('register');
});

router.post('/registration', function(req, res) {
  User.register(new User({username:req.body.username}), 
      req.body.password, function(err, user){
    if (err) {
      // NOTE: error? send message back to registration...
      res.render('register',{message:'Your registration information is not valid'});
    } else {
      // NOTE: once you've registered, you should be logged in automatically
      // ...so call authenticate if there's no error
      passport.authenticate('local')(req, res, function() {
        res.redirect('/home');
      });
    }
  });   
});

router.get('/home', function(req, res) {
  User.findOne({'username':username}, function(err, user) {
    res.render('index', {goal:user.goals});
  });
});

router.get('/api/goals', function(req, res) {
  User.findOne({'username':username}, function(err, user) {
    res.json(user.goals.map(function(ele) {
      return {
        "title":ele.title,
        "description":ele.description
      }
    }));
  })
})

router.post('/api/goals/create', function(req, res) {
  var goal = new Goal({
    title:req.body.title,
    description:req.body.description
  });
  User.findOne({'username':username}, function(err, user) {
    user.goals.push(goal);
    user.save(function(err, user) {
      console.log('saved a new goal for :', user);
      res.json(user.goals);
    });
  });
});

module.exports = router;
