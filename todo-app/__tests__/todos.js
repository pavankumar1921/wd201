const request = require("supertest");
var cheerio = require("cheerio");

const db = require("../models/index");
const app = require("../app");

let server, agent;
function extractCsrfToken(res) {
  var $ = cheerio.load(res.text);
  return $("[name=_csrf]").val();
}

//helper function i.e login helper
const login = async (agent, username, password) => {
  let res = await agent.get("/login");
  let csrfToken = extractCsrfToken(res);
  res = await agent.post("/session").send({
    email: username,
    password: password,
    _csrf: csrfToken,
  });
};

describe("Todo Application", function () {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(6000, () => {});
    agent = request.agent(server);
  });

  afterAll(async () => {
    try {
      await db.sequelize.close();
      await server.close();
    } catch (error) {
      console.log(error);
    }
  });

  test("Sign Up", async () => {
    let res = await agent.get("/signup");
    const csrfToken = extractCsrfToken(res);
    res = await agent.post("/users").send({
      firstName: "Test",
      lastName: "One",
      email: "test@gmail.com",
      password: "12345678",
      _csrf: csrfToken,
    });
    expect(res.statusCode).toBe(302);
  });

  test("Sign out", async () => {
    let res = await agent.get("/todos");
    expect(res.statusCode).toBe(200);
    res = await agent.get("/signout");
    expect(res.statusCode).toBe(302);
    res = await agent.get("/todos");
    expect(res.statusCode).toBe(302);
  });

  test("Create a todo", async () => {
    const agent = request.agent(server);
    await login(agent, "test@gmail.com", "12345678");
    const res = await agent.get("/todos");
    const csrfToken = extractCsrfToken(res);
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    expect(response.statusCode).toBe(302);
  });

  test("Marks a todo as complete", async () => {
    const agent = request.agent(server);
    await login(agent, "test@gmail.com", "12345678");
    let res = await agent.get("/todos");
    let csrfToken = extractCsrfToken(res);
    await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    const groupedTodoResponse = await agent
      .get("/todos")
      .set("Accept", "application/json");
    let parsedGroupedResponse = JSON.parse(groupedTodoResponse.text);
    let dueTodayCount = parsedGroupedResponse.dueToday.length;
    let latestTodo = parsedGroupedResponse.dueToday[dueTodayCount - 1];
    let status = latestTodo.completed ? false : true;
    console.log(latestTodo.completed);
    console.log(status);
    res = await agent.get("/todos");
    csrfToken = extractCsrfToken(res);

    const markCompleteResponse = await agent
      .put(`/todos/${latestTodo.id}`)
      .send({ _csrf: csrfToken, completed: status });

    let parsedUpdateResponse = JSON.parse(markCompleteResponse.text);
    console.log(parsedUpdateResponse);
    expect(parsedUpdateResponse.completed).toBe(true);
  });

  test("Marking a todo item as incomplete", async () => {
    const agent = request.agent(server);
    await login(agent, "test@gmail.com", "12345678");
    let res = await agent.get("/todos");
    let csrfToken = extractCsrfToken(res);
    await agent.post("/todos").send({
      title: "Buy book",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    const groupedTodoResponse = await agent
      .get("/todos")
      .set("Accept", "application/json");
    const parsedGroupedResponse = JSON.parse(groupedTodoResponse.text);
    const dueTodayCount = parsedGroupedResponse.dueToday.length;
    const latestTodo = parsedGroupedResponse.dueToday[dueTodayCount - 1];

    res = await agent.get("/todos");
    csrfToken = extractCsrfToken(res);

    let response = await agent.put(`/todos/${latestTodo.id}`).send({
      _csrf: csrfToken,
      completed: true,
    });
    var parsedUpdateResponse = JSON.parse(response.text);
    console.log(parsedUpdateResponse.completed);
    expect(parsedUpdateResponse.completed).toBe(true);

    res = await agent.get("/todos");
    csrfToken = extractCsrfToken(res);
    response = await agent.put(`/todos/${latestTodo.id}`).send({
      _csrf: csrfToken,
      completed: false,
    });

    parsedUpdateResponse = JSON.parse(response.text);
    console.log(parsedUpdateResponse.completed);
    expect(parsedUpdateResponse.completed).toBe(false);
  });

  test("User A Can not modify the USer B response or todo", async () => {
    var agent = request.agent(server);
    await login(agent, "test@gmail.com", "12345678");
    var res = await agent.get("/todos");
    var csrfToken = extractCsrfToken(res);
    await agent.post("/todos").send({
      title: "Buy Pages",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });

    const Todos = await agent.get("/todos").set("Accept", "application/json");
    const parseTodos = JSON.parse(Todos.text);
    const countTodaysTodos = parseTodos.dueToday.length;
    const Todo = parseTodos.dueToday[countTodaysTodos - 1];
    const todoID = Todo.id;
    const status = Todo.completed ? false : true;

    res = await agent.get("/signout");
    expect(res.statusCode).toBe(302);

    res = await agent.get("/signup");
    csrfToken = extractCsrfToken(res);
    const response = await agent.post("/users").send({
      firstName: "user",
      lastName: "test",
      email: "userB@gmail.com",
      password: "12345678",
      _csrf: csrfToken,
    });
    expect(response.statusCode).toBe(302);

    await login(agent, "userB@gmail.com", "12345678");

    res = await agent.get("/todos");
    csrfToken = extractCsrfToken(res);

    // console.log(Todo);

    const changeTodo = await agent
      .put(`/todos/${todoID}`)
      .send({ _csrf: csrfToken, completed: status });

    const parseUpadteTodo = JSON.parse(changeTodo.text);
    console.log("Complete : " + parseUpadteTodo.completed);
    console.log("status : " + status);
    expect(parseUpadteTodo.completed).toBe(!status);
  });

  test("Delete a todo", async () => {
    const agent = request.agent(server);
    await login(agent, "test@gmail.com", "12345678");
    let resp = await agent.get("/todos");
    let csrfToken = extractCsrfToken(resp);
    await agent.post("/todos").send({
      title: "buy a pen",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    const groupedTodoResponse = await agent
      .get("/todos")
      .set("Accept", "application/json");
    const parsedGroupedResponse = JSON.parse(groupedTodoResponse.text);
    const dueTodayCount = parsedGroupedResponse.dueToday.length;
    const latestTodo = parsedGroupedResponse.dueToday[dueTodayCount - 1];

    resp = await agent.get("/todos");
    csrfToken = extractCsrfToken(resp);

    const deleteResponse = await agent.delete(`/todos/${latestTodo.id}`).send();
    const parsedDeletedResponse = JSON.parse(deleteResponse.text);
    console.log(parsedDeletedResponse.success);
    expect(parsedDeletedResponse.success).toBe(true);
  });
});
