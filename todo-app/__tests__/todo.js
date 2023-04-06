const request = require("supertest");

const db = require("../models/index");
const app = require("../app");

//express application is server
//agent is supertest agent which will be used to send http requests
let server, agent;

describe("Todo test suite", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(3000, () => {});
    agent = request.agent(server);
  });
  afterAll(async () => {
    await db.sequelize.close();
    server.close();
  });

  test("responds with json at .todos", async () => {
    const response = await agent.post("/todos").send({
      title: " buy cable",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    expect(response.statusCode).toBe(200);
    expect(response.header["content-type"]).toBe(
      "application/json; charset=utf-8"
    );
    const parsedResponse = JSON.parse(response.text);
    expect(parsedResponse.id).toBeDefined();
  });
  test("mark as complete", async () => {
    const response = await agent.post("/todos").send({
      title: " buy charger",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    const parsedResponse = JSON.parse(response.text);
    const todoId = parsedResponse.id;

    expect(parsedResponse.completed).toBe(false);

    const markCompletedRes = await agent
      .put(`/todos/${todoId}/markAsCompleted`)
      .send();
    const parsedUpdateResponse = JSON.parse(markCompletedRes.text);
    expect(parsedUpdateResponse.completed).toBe(true);
  });
});
