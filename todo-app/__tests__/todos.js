const request = require("supertest");
var cheerio = require("cheerio");

const db = require("../models/index");
const app = require("../app");

let server, agent;
function extractCsrfToken(res) {
  var $ = cheerio.load(res.text);
  return $("[name=_csrf]").val();
}

describe("Todo Application", function () {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(5000, () => {});
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

  test("Create a todo", async () => {
    const res = await agent.get("/");
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
    let res = await agent.get("/");
    let csrfToken = extractCsrfToken(res);
    await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: true,
      _csrf: csrfToken,
    });
    const groupedTodoResponse = await agent
      .get("/")
      .set("Accept", "application/json");
    let parsedGroupedResponse = JSON.parse(groupedTodoResponse.text);
    let dueTodayCount = parsedGroupedResponse.dueToday.length;
    let latestTodo = parsedGroupedResponse.dueToday[dueTodayCount - 1];
    let status = latestTodo.completed ? false : true;
    console.log(latestTodo.completed);
    console.log(status);
    res = await agent.get("/");
    csrfToken = extractCsrfToken(res);

    const markCompleteResponse = await agent
      .put(`/todos/${latestTodo.id}`)
      .send({ _csrf: csrfToken, completed: status });

    let parsedUpdateResponse = JSON.parse(markCompleteResponse.text);
    console.log(parsedUpdateResponse);
    expect(parsedUpdateResponse.completed).toBe(true);
  });

  test("Marking todo as incomplete", async () => {
    let res = await agent.get("/");
    let csrfToken = extractCsrfToken(res);
    await agent.post("/todos").send({
      title: "Buy book",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    const groupedTodoResponse = await agent
      .get("/")
      .set("Accept", "application/json");
    const parsedGroupedResponse = JSON.parse(groupedTodoResponse.text);
    const dueTodayCount = parsedGroupedResponse.dueToday.length;
    const latestTodo = parsedGroupedResponse.dueToday[dueTodayCount - 1];

    res = await agent.get("/");
    csrfToken = extractCsrfToken(res);

    let response = await agent.put(`/todos/${latestTodo.id}`).send({
      _csrf: csrfToken,
      completed: true,
    });
    var parsedUpdateResponse = JSON.parse(response.text);
    console.log(parsedUpdateResponse.completed);
    expect(parsedUpdateResponse.completed).toBe(true);

    res = await agent.get("/");
    csrfToken = extractCsrfToken(res);
    response = await agent.put(`/todos/${latestTodo.id}`).send({
      _csrf: csrfToken,
      completed: false,
    });

    parsedUpdateResponse = JSON.parse(response.text);
    console.log(parsedUpdateResponse.completed);
    expect(parsedUpdateResponse.completed).toBe(false);
  });

  test("Delete a todo", async () => {
    let resp = await agent.get("/");
    let csrfToken = extractCsrfToken(resp);
    await agent.post("/todos").send({
      title: "buy a pen",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    const groupedTodoResponse = await agent
      .get("/")
      .set("Accept", "application/json");
    const parsedGroupedResponse = JSON.parse(groupedTodoResponse.text);
    const dueTodayCount = parsedGroupedResponse.dueToday.length;
    const latestTodo = parsedGroupedResponse.dueToday[dueTodayCount - 1];

    resp = await agent.get("/");
    csrfToken = extractCsrfToken(resp);

    const deleteResponse = await agent.delete(`/todos/${latestTodo.id}`).send();
    const parsedDeletedResponse = JSON.parse(deleteResponse.text);
    console.log(parsedDeletedResponse.success);
    expect(parsedDeletedResponse.success).toBe(true);
  });
});
