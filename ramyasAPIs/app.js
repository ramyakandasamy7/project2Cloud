const express = require("express");
const app = express();
const ownerAPI = require("./ownerAPI");
const userAPI = require("./userAPI");
const gymAPI = require("./gymAPI");
const requestAPI = require("./requestAPI");

app.use(ownerAPI);
app.use(gymAPI);
app.use(requestAPI);
app.use(userAPI);
app.listen(3000, function() {
  console.log("Listening on port 3000");
});
