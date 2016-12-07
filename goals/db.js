var mongoose = require('mongoose');
var URLSlugs = require('mongoose-url-slugs');
var passportLocalMongoose = require('passport-local-mongoose');

var GoalSchema = new mongoose.Schema({
  title:String,
  description:String,
  startDate: {type:Date, default:Date.now()},
  endDate:Date,
  deltaDate:String
});

var UserSchema = new mongoose.Schema({ 
  username:String,
  password:String,
  goals:[GoalSchema],
  completed:[GoalSchema]
});
// User.register (creating a new user)
// User.authenticate (strategy)

UserSchema.plugin(passportLocalMongoose);

mongoose.model('User', UserSchema);
mongoose.model('Goal', GoalSchema);

// is the environment variable, NODE_ENV, set to PRODUCTION? 
if (process.env.NODE_ENV == 'PRODUCTION') {
 // if we're in PRODUCTION mode, then read the configration from a file
 // use blocking file io to do this...
 var fs = require('fs');
 var path = require('path');
 var fn = path.join(__dirname, 'config.json');
 var data = fs.readFileSync(fn);

 // our configuration file will be in json, so parse it and set the
 // conenction string appropriately!
 var conf = JSON.parse(data);
 var dbconf = conf.dbconf;
} else {
 // if we're not in PRODUCTION mode, then use
 dbconf = 'mongodb://localhost/goals';
}

mongoose.connect(dbconf);