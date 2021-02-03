const exec = require("child_process").exec;
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
let saveStatus = null;
let gitStatus = null;
let savdData = null;

app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "static")));

app.get("/", (req, res) => {
  console.log("Found new USER");
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
  }, 100);
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
    console.log("File data sended");
  }, 100);
});

app.post("/post/save", (req, res) => {
  let location = req.body.location;
  savdData = req.body.fileData;
  writeFiles(location);
  console.log("Found Saving request");

  setTimeout(() => {
    var jsonString = {
      found: saveStatus,
    };
    res.send(JSON.stringify(jsonString));
    console.log("Saving status sended");
  }, 100);
});

app.post("/git/push", (req, res) => {
  let location = req.body.location;
  let changeName = req.body.files;

  pushGit(location, changeName);
  console.log("Exicuting git commands");

  setTimeout(() => {
    var jsonString = {
      found: gitStatus,
    };
    res.send(JSON.stringify(jsonString));
  }, 1000);
});

//Game star here...
// Go to the given folder and check is it a file with an extention or...
const travelFolder = (filePath) => {
  fs.readdir(filePath, (err, files) => {
    if (err) {
      console.log("They send us an wrong location\n", err);
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
    console.log("They send us an wrong location\n", err);
  });
  readStream.on("data", (chunk) => {
    fileItem = chunk;
  });
};

//Save the file
const writeFiles = (filePath) => {
  console.log("writing file");

  const writerStream = fs
    .createWriteStream(filePath, { flags: "w" })
    .on("finish", function () {
      console.log("Writing File completed");
    })
    .on("error", function (err) {
      saveStatus = " File Path location is Wrong";
      console.log(err.stack);
    });
  writerStream.write(savdData, () => {
    saveStatus = "Saved";
  });
  writerStream.end();
};

//Push it with git command
const pushGit = (filePath, changeName) => {
  let command = `cd ${filePath} && git add . && git commit -m "updated: ${changeName}by BOT" && git push origin master`;

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.log(err);
      gitStatus = err;
      return;
    }
    if (stderr) {
      console.log(stderr);
      gitStatus = stderr;
      return;
    }
    console.log("\n");
    console.log(stdout);
    console.log("\ngit exicution sended");
    gitStatus = stdout;
  });
};
