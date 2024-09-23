fetch("http://localhost:3001/api/testing/yes", {
    method: "POST",
    body: JSON.stringify({
      username: "yousefsosexyxx",
      password: "SDFAEFEF"
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  }).then((response) => response.json())
  .then((json) => console.log(json))