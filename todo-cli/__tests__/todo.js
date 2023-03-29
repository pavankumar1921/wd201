const todoList = require('../todo')
const {all,markAsComplete,add} = todoList()

describe("todolist test suite",() =>{
    beforeAll(()=>{
        add(
            {
                title:"Buying earphones",
                completed:false,
                dueDate: new Date().toLocaleDateString("en-CA")
            }
        ) 
    })
    test("adding todo list",()=>{
        const todoItemsCount = all.length
        add(
            {
                title:"Buying earphones",
                completed:false,
                dueDate: new Date().toLocaleDateString("en-CA")
            }
        )
       expect(all.length).toBe(todoItemsCount+1) 
    })
    test("Marking as complete",()=>{
        expect(all[0].completed).toBe(false)
        markAsComplete(0)
        expect(all[0].completed).toBe(true)
    })
})