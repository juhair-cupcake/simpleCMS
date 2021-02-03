const express = require("express");
const path = require("path");
// const EventEmitter = require("events");
const fs = require("fs");
const app = express();

//Varriables
// const evEmit = new EventEmitter();
let dirFolder = [];
let dirFiles = [];
let fileItem = null;
let count = 0;

app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "static")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "index.html"));
});

console.clear();
//Listen to the port
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// Route
app.post("/post/location", (req, res) => {
  console.log(count);
  count = 0;
  let location = req.body.location;

  dirFolder.length = 0;
  dirFiles.length = 0;
  travelFolder(location);
  console.log("found Base Location");

  setTimeout(() => {
    var jsonString = {
      found: dirFiles,
    };
    res.send(JSON.stringify(jsonString));
    console.log("All file list sended");
  }, 50);
});

app.post("/post/file", (req, res) => {
  let location = req.body.location;
  readFiles(location);
  console.log("found Singe file path");

  setTimeout(() => {
    var jsonString = {
      found: fileItem,
    };
    res.send(JSON.stringify(jsonString));
    console.log("sending file data");
  }, 50);
});

//Game star here...
// Go to the given folder and check is it a file with an extention or...
const travelFolder = (filePath) => {
  count++;
  fs.readdir(filePath, (err, files) => {
    if (err) {
      console.log(err);
      dirFiles.push("Wrong Location!!!");
    } else if (files != null) {
      [...files].forEach((file) => {
        //check the file extention
        let place = `${filePath}/${file}`;
        let extention = path.extname(file);

        //Check is it a folder...?
        fs.stat(place, (err, stats) => {
          if (err) {
            console.log(err);
          } else if (stats.isDirectory() && file[0] != ".") {
            if (dirFolder.indexOf(place) == -1) {
              dirFolder.push(place);
              travelFolder(place);
            }
          } else if (
            stats.isFile() &&
            (extention == ".md" || extention == ".yml" || extention == ".toml")
          ) {
            dirFiles.push(place);
          }
        });
      });
    }
  });
};

// Read the valid files
const readFiles = (filePath) => {
  fileItem = "Wrong Location!!!";
  console.log("reading file");
  const readStream = fs.createReadStream(filePath, "utf8");
  readStream.on("error", (err) => {
    console.log(err);
    readStream.destroy();
  });
  readStream.on("data", (chunk) => {
    fileItem = chunk;
    readStream.destroy();
  });
};
