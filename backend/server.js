const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 8080;
const db = require("./queries");
const cors = require("cors");

app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "PUT", "POST", "DELETE"],
    credentials: true,
  })
);
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (request, response) => {
  response.json({ info: "Node.js, Express, and Postgres API" });
});

app.get("/users", db.getUsers);
app.get("/users/:id", db.getUserById);
app.post("/createuser", db.createUser);
app.put("/updateuser/:id", db.updateUser);
app.delete("/deleteuser/:id", db.deleteUser);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
