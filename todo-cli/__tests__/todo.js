/* eslint-disable no-undef */

const todoList = require("../todo");
const { all, markAsComplete, add, overdue, dueToday, dueLater } = todoList();

describe("todolist test suite", () => {
  beforeAll(() => {
    const today = new Date();
    add({
      title: "Buying earphones",
      completed: false,
      dueDate: new Date(today.getTime() - 86400000).toISOString().slice(0, 10),
    }),
      add({
        title: "buying mobile",
        completed: false,
        dueDate: new Date().toISOString().slice(0, 10),
      }),
      add({
        title: "buying connector",
        completed: false,
        dueDate: new Date(today.getTime() + 86400000)
          .toISOString()
          .slice(0, 10),
      });
  });
  test("adding new todo", () => {
    const todoItemsCount = all.length;
    add({
      title: "Buying charger",
      completed: false,
      dueDate: new Date().toISOString().slice(0, 10),
    });
    expect(all.length).toBe(todoItemsCount + 1);
  });
  test("Marking as complete", () => {
    expect(all[0].completed).toBe(false);
    markAsComplete(0);
    expect(all[0].completed).toBe(true);
  });
  test("Checking overdue", () => {
    expect(overdue().length).toBe(1);
  });
  test("Checking dueToday", () => {
    expect(dueToday().length).toBe(2);
  });
  test("checking dueLAter", () => {
    expect(dueLater().length).toBe(1);
  });
});
