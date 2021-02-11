const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 8080;

app.use(express.static(__dirname + "/dist/hacker-premier-league-app"));

app.get("/*", function (req, res) {
  res.sendFile(
    path.join(__dirname + "/dist/hacker-premier-league-app/index.html")
  );
});

app.listen(port, () => {
  console.log(`server started and listening to port ${port}...`);
});
