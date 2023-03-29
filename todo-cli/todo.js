const todoList = () => {
    all = []
    const add = (todoItem) => {
      all.push(todoItem)
    }
    const markAsComplete = (index) => {
      all[index].completed = true
    }
  
    const overdue = () => {
      return all.filter((dt)=>dt.dueDate<today)
    }
  
    const dueToday = () => {
      return all.filter((dt)=>dt.dueDate==today)
    }
  
    const dueLater = () => {
      return all.filter((dt)=>dt.dueDate>today)
    }
  
    const toDisplayableList = (list) => {
      return list.map((dt)=>`${dt.completed ? "[x]":"[ ]"} ${dt.title} ${dt.dueDate == today ? "":dt.dueDate}`).join("\n")
    }
  
    return {
      all,
      add,
      markAsComplete,
      overdue,
      dueToday,
      dueLater,
      toDisplayableList
    };
  };
 
  module.exports = todoList;