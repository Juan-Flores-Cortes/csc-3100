// backend.js
import cors from "cors";
import express from "express";
import userService from "./services/user-service.js";
import dotev from "dotenv";
import mongoose from "mongoose";

dotev.config();

const {MONGO_CONNECTION_STRING} = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING + "users")
  .catch((error) => console.log(error));
  
const app = express();
const port = 8000;





app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.json("Hello World");
});

app.post("/users", (req, res) => {
  const userToAdd = req.body;

  userService.addUser(userToAdd)
    .then((newUser) => {
      res.status(201).send(newUser);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

app.get("/users/:id", (req, res) => {
  const id = req.params["id"];

  userService.findUserById(id)
    .then((result) => {
      if (result === null) {
        res.status(404).send("Resource not found.");
      } else {
        res.send(result);
      }
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;

  userService.getUsers(name, job)
    .then((result) => {
      const users = { users_list: result };
      res.send(users);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

app.delete("/users/:id", (req, res) => {
  const idToDelete = req.params.id;

  userService.removeUser(idToDelete)
    .then((userToDelete) => {
      if (userToDelete === null) {
        res.status(404).send("Resource not found");
      } else {
        res.status(204).send();
      }
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});