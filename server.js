const express = require("express");
const path = require("path");

const app = express();
app.listen(process.env.PORT || 3001);

app.use(express.static("public")); // Sets up middleware to serve static files from /public
// STUDY NOTE: this means that any files placed in the "public" directory can be accessed by the client directly through the URL, without requiring any additional routing.
