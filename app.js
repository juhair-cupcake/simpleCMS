const express = require("express");
const path = require("path");
const readline = require("readline");
const fs = require("fs");
const app = express();

app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "static")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "index.html"));
});

var absolutePath = path.resolve(
  "/home/error6251/Documents/Project/blogge-hugo/content/posts/my-blog-post.md"
);
const readStream = fs.createReadStream(absolutePath, "utf8");
readStream.on("data", (chunk) => {
  console.log(chunk);
});

//Listen to the port
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
