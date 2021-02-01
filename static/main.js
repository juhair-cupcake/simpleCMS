const textEditor = document.getElementById("editor");
let input1 = document.getElementById("path1").value;
let input2 = document.getElementById("path2").value;

// Fetch the First Output
const showOutput1 = () => {
  let collectOutput1 = setInterval(() => {
    fetch(`/result/files`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("HTTP error " + response.status);
          clearInterval(collectOutput1);
        }
        return response.json();
      })
      .then((json) => {
        //Show The output
        document.getElementById("output1").innerHTML = "";
        json.found.map((showIt) => {
          document.getElementById("output1").innerHTML += `${showIt}<br>`;
        });
        clearInterval(collectOutput1);
      })
      .catch(function () {
        this.dataError = true;
      });
  }, 1000);
};

// Fetch the second Output
const showOutput2 = () => {
  let collectOutput2 = setInterval(() => {
    fetch(`/result/text`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("HTTP error " + response.status);
          clearInterval(collectOutput2);
        }
        return response.json();
      })
      .then((json) => {
        textEditor.value = json.found;
        document.getElementById("preview").innerHTML = marked(textEditor.value);
        clearInterval(collectOutput2);
      })
      .catch(function () {
        this.dataError = true;
      });
  }, 1000);
};

submited1 = (e) => {
  e.preventDefault();

  input1 = document.getElementById("path1").value;

  fetch(`/post/location`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      location: input1,
    }),
  });

  showOutput1();
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
  });

  showOutput2();
  return false;
};

textEditor.addEventListener("keyup", (env) => {
  const { value } = env.target;

  document.getElementById("preview").innerHTML = marked(value);
});
