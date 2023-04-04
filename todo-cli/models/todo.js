'use strict';
const {
  Model,Op
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static async addTask(params){
      return await Todo.create(params)
    }
    static async showList(){
      console.log("My Todo list \n");

      console.log("Overdue");
      console.log((await Todo.overdue())
      .map((todo)=>{return todo.displayableString()}))
      console.log("\n");

      console.log("Due Today");
      console.log((await Todo.dueToday())
      .map((todo)=>{return todo.displayableString()}))
      console.log("\n");

      console.log("Due Later");
      console.log((await Todo.dueLater())
      .map((todo)=>{return todo.displayableString()}))
    }

    static async overdue(){
      return Todo.findAll({
        where:{
          dueDate : { [Op.lt]: new Date().toISOString().slice(0,10)}
        }
      })
    }

    static async dueToday(){
      return Todo.findAll({
        where:{
          dueDate : { [Op.eq]: new Date().toISOString().slice(0,10)}
        }
      })
    }

    static async dueLater(){
      return Todo.findAll({
        where:{
          dueDate : { [Op.gt]: new Date().toISOString().slice(0,10)}
        }
      })
    }

    static async markAsComplete(id){
      await Todo.update({
        completed:true
      },
      {where:{
        id:id
      }})
    }

    displayableString(){
      let checkbox = this.completed ? "[x]" : "[ ]";
      return `${this.id}. ${checkbox} ${this.title} ${this.dueDate === new Date().toISOString().slice(0,10) ? "":this.dueDate}`.trim();
    }
    static associate(models) {
      // define association here
    }
  }
  Todo.init({
    title: DataTypes.STRING,
    dueDate: DataTypes.DATEONLY,
    completed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Todo',
  });
  return Todo;
};