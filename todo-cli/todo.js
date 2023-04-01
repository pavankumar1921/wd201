const todoList = () => {
  const all = [];
  const add = (todoItem) => {
    all.push(todoItem);
  };
  const markAsComplete = (index) => {
    all[index].completed = true;
  };

  const overdue = () => {
    return all.filter(
      (dt) => dt.dueDate < new Date().toISOString().slice(0, 10)
    );
  };

  const dueToday = () => {
    return all.filter(
      (dt) => dt.dueDate === new Date().toISOString().slice(0, 10)
    );
  };

  const dueLater = () => {
    return all.filter(
      (dt) => dt.dueDate > new Date().toISOString().slice(0, 10)
    );
  };

  const toDisplayableList = (list) => {
    return list
      .map((dt) =>
        `${dt.completed ? "[x]" : "[ ]"} ${dt.title} ${
          dt.dueDate === new Date().toISOString().slice(0, 10) ? "" : dt.dueDate
        }`.trim()
      )
      .join("\n");
  };

  return {
    all,
    add,
    markAsComplete,
    overdue,
    dueToday,
    dueLater,
    toDisplayableList,
  };
};

module.exports = todoList;
