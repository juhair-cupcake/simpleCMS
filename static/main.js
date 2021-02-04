const textEditor = document.getElementById("editor");
let input1 = "",
  input2 = "",
  input3 = "",
  updatedFiles = "",
  updateList = [],
  rootDir = "";
document.getElementById("preview").innerHTML = marked(textEditor.value);

// Welcome to the callBack HELLLLLLL...
const submited1 = (e) => {
  input1 = document.getElementById("path1").value;

  fetch(`/post/location`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      location: input1,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      //Catch the Responce
      return response.json();
    })
    .then((json) => {
      //Show The output
      document.getElementById("output1").innerHTML = "";
      json.found.map((showIt) => {
        document.getElementById("output1").innerHTML += `${showIt}<br>`;
      });
    })
    .catch(function () {
      this.dataError = true;
    });
  return false;
};

const submited2 = (e) => {
  e.preventDefault();

  input2 = document.getElementById("path2").value;

  fetch(`/post/file`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      location: input2,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      //Catch the Responce
      return response.json();
    })
    .then((json) => {
      textEditor.value = json.found;
      document.getElementById("preview").innerHTML = marked(textEditor.value);
    })
    .catch(function () {
      this.dataError = true;
    });
};

//Now Save The File
const saveIt = (e) => {
  e.preventDefault();
  rootDir = document.getElementById("path1").value;
  rootDir += "/";
  fileNameX = input2.replace(rootDir, "");

  if (updateList.indexOf(fileNameX) == -1) {
    updatedFiles += `${fileNameX}, `;
    updateList.push(fileNameX);
  }

  fetch(`/post/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      location: input2,
      fileData: textEditor.value,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      //Catch the Responce
      return response.json();
    })
    .then((json) => {
      console.log(json.found);
    })
    .catch(function () {
      this.dataError = true;
    });
};

//Push the file on git
const pushIt = (e) => {
  e.preventDefault();

  input3 = document.getElementById("path3").value;
  if (input3 == input1) {
    fetch(`/git/push`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        location: input3,
        files: updatedFiles,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("HTTP error " + response.status);
        }
        //Catch the Responce
        return response.json();
      })
      .then((json) => {
        console.log(updatedFiles);
        updatedFiles = "";
        updateList.length = 0;
        console.log(json.found);
      })
      .catch(function () {
        this.dataError = true;
      });

    document.getElementById("path3").value = "";
  } else {
    document.getElementById("path3").value = "Wrong location";
  }
};

//Update The Text area and MD viewer
textEditor.addEventListener("keyup", (env) => {
  const { value } = env.target;
  document.getElementById("preview").innerHTML = marked(value);
});
