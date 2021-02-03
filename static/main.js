const textEditor = document.getElementById("editor");
let input1 = document.getElementById("path1").value;
let input2 = document.getElementById("path2").value;

// Welcome to the callBack HELLLLLLL...
submited1 = (e) => {
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

      console.log("found 2");
    })
    .catch(function () {
      this.dataError = true;
    });
  return false;
};
submited2 = (e) => {
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
      console.log("found 2");
    })
    .catch(function () {
      this.dataError = true;
    });
};

//Update The Text area and MD viewer
textEditor.addEventListener("keyup", (env) => {
  const { value } = env.target;
  document.getElementById("preview").innerHTML = marked(value);
});
