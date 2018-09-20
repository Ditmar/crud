const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/redes", { useNewUrlParser: true });
module.exports = mongoose;
