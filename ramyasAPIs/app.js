const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const cors = require("cors");
const ownerAPI = require("./ownerAPI");
const userAPI = require("./userAPI");
const gymAPI = require("./gymAPI");
const requestAPI = require("./requestAPI");
const ratingAPI = require("./ratingAPI");
app.use(cors());
app.use(fileUpload());
app.use(ownerAPI);
app.use(gymAPI);
app.use(requestAPI);
app.use(userAPI);
app.use(ratingAPI);
app.listen(3000, function() {
  console.log("Listening on port 3000");
});
