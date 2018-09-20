var mongoose = require("./connect");
var USERS = {
  username: String,
  name: String,
  password: String,
  registerDate: Date
}
const users = mongoose.model('users', USERS);
module.exports = users
