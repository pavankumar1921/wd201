/* eslint-disable no-undef */

const todoList = require("../todo");
const { all, markAsComplete, add, overdue, dueToday, dueLater } = todoList();

describe("todolist test suite", () => {
  const today = new Date();
  beforeAll(() => {
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
    const overDueTodoItemsCount = overdue().length;
    add({
      title: "for overdue",
      completed: false,
      dueDate: new Date(today.getTime() - 86400000).toISOString().slice(0, 10),
    });
    expect(overdue().length).toBe(overDueTodoItemsCount + 1);
  });
  test("Checking dueToday", () => {
    const dueTodayItemsCount = dueToday().length;
    // console.log(dueTodayItemsCount)
    add({
      title: "for dueToday",
      completed: false,
      dueDate: new Date().toISOString().slice(0, 10),
    });
    // console.log(dueTodayItemsCount+1)
    expect(dueToday().length).toBe(dueTodayItemsCount + 1);
  });
  test("checking dueLAter", () => {
    const dueLaterItemsCount = dueLater().length;
    // console.log(dueLaterItemsCount)
    add({
      title: "for due later",
      completed: false,
      dueDate: new Date(today.getTime() + 86400000).toISOString().slice(0, 10),
    });
    // console.log(dueLaterItemsCount +  1)
    expect(dueLater().length).toBe(dueLaterItemsCount + 1);
  });
});
