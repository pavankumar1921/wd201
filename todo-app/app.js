const express = require("express");
const app = express();

//importing model to perform any operation
const { Todo } = require("./models");

const bodyParser = require("body-parser");
app.use(bodyParser.json());

// app.get("/", (request, response) => {
//   response.send("hello world");
// });

// eslint-disable-next-line no-unused-vars
app.get("/todos", (request, response) => {
  console.log("Todo list");
});

app.post("/todos", async (request, response) => {
  console.log("creating todo", request.body);
  try {
    const todo = await Todo.addTodo({
      title: request.body.title,
      dueDate: request.body.dueDate,
      completed: false,
    });
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id/markAsCompleted", async (request, response) => {
  console.log("update todo with id", request.params.id);
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodo = await todo.markAsCompleted();
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

// eslint-disable-next-line no-unused-vars
app.delete("/todos/:id", async (request, response) => {
  console.log("delete todo by id:", request.params.id);
});

module.exports = app;
