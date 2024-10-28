import {v4 as uuidv4} from 'uuid'
import { toggleModal } from './Generic'

export type statusTodo = 'Active' | 'Pause' | 'Resolved' | 'Closed'
export type priorityTodo = 'Low' | 'Medium' | 'High' | 'Very high'

export interface ITodo{
    title: string
    description: string
    expiredate: Date
    status: statusTodo
    priority: priorityTodo
}

//Todo class
export class ToDo implements ITodo{
    title: string
    description: string
    expiredate: Date
    status: statusTodo
    priority: priorityTodo

    colorStatus: string = '#931f1f'
    symbolStatus: string
    colorPriority: string = '#931f1f'
    id: string

    constructor(data:ITodo){
        this.id = uuidv4()
        for (const key in data) {
            this[key] = data[key]
        }
    }
}
