console.clear();
const express = require("express");
const path = require("path");
const EventEmitter = require("events");
const fs = require("fs");
const app = express();

//Varriables
const evEmit = new EventEmitter();
//let location = "/home/error6251/Documents/Project/blogge-hugo";
let dirFolder = [];
let dirFiles = [];
let fileItem;

app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "static")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "index.html"));
});

//Listen to the port
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// Route
app.post("/post/location", (req, res) => {
  let location = req.body.location;
  travelFolder(location);
});

app.get("/result/files", function (req, res) {
  var jsonString = {
    found: dirFiles,
  };
  res.send(JSON.stringify(jsonString));
});

app.post("/post/file", (req, res) => {
  let location = req.body.location;
  readFiles(location);
});

app.get("/result/text", function (req, res) {
  var jsonString = {
    found: fileItem,
  };
  res.send(JSON.stringify(jsonString));
});

//Game star here...

// Go to the given folder and check is it a file with an extention or...
const travelFolder = (filePath) => {
  dirFolder.length = 0;
  dirFiles.length = 0;
  fs.readdir(filePath, (err, files) => {
    if (files != null)
      [...files].forEach((file) => {
        //check the file extention

        let place = `${filePath}/${file}`;
        let extention = path.extname(file);

        if (extention == "") {
          if (dirFolder.indexOf(place) == -1) {
            dirFolder.push(place);
            travelFolder(place);
          }
        } else {
          dirFiles.push(place);
        }
      });
  });
};

// Read the valid files
const readFiles = (filePath) => {
  fileItem = "null";
  const readStream = fs.createReadStream(filePath, "utf8");
  readStream.on("data", (chunk) => {
    fileItem = chunk;
  });
};
