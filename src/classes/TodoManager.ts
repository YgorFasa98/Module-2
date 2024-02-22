import { ToDo, ITodo, statusTodo, priorityTodo } from './Todo'
import { toggleModal } from './Generic'
import { status } from './Project'

export class TodoManager {
    list: ToDo[] = []
    ui: HTMLDivElement
    defaultTodo: ITodo = { //default Project data
        title: 'Example Todo 1',
        description: 'Description of example todo 1',
        expiredate: new Date('10-10-2010'),
        status: 'Active',
        priority: 'Medium',
    }

    constructor (containerTodo:HTMLDivElement){ //selezionare il container
        containerTodo.innerHTML = ''
        this.ui = containerTodo
        this.newTodo(this.defaultTodo)
    }

    newTodo(data:ITodo){
        const todo = new ToDo(data)
        this.ui.append(todo.ui)
        this.list.push(todo)
        return todo
    }

    getTodo(){
        
    }

    deleteTodo(){

    }

    updateTodo(status:statusTodo,priority:priorityTodo){
        
    }

}