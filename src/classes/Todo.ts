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
    ui: HTMLElement

    constructor(data:ITodo){
        this.id = uuidv4()
        for (const key in data) {
            this[key] = data[key]
        }
        this.createUI()
    }

    templateUI(){
        if (this.priority=='Low'){this.colorPriority='#a9c167'}
        else if (this.priority=='Medium'){this.colorPriority='#ffe45c'}
        else if (this.priority=='High'){this.colorPriority='#dd994b'}
        else if (this.priority=='Very high'){this.colorPriority='#b83232'}

        if (this.status=='Active'){this.colorStatus='#ff0000'; this.symbolStatus='priority_high'}
        else if (this.status=='Closed'){this.colorStatus='#a0a0a0'; this.colorPriority='#a0a0a0'; this.symbolStatus='close'}
        else if (this.status=='Pause'){this.colorStatus='#ffff00'; this.symbolStatus='pause'}
        else if (this.status=='Resolved'){this.colorStatus='#009900'; this.symbolStatus='done'}

        this.ui.className = 'to-do-card'
        this.ui.style.backgroundColor = this.colorPriority
        this.ui.innerHTML = `
        <span id="deletetodo" class="material-icons-outlined edittodo" style="display: none; background-color: var(--background); border-radius: 5px; padding: 10px;">delete</span>
        <span id="edittodo" class="material-icons-outlined edittodo" style="display: none; background-color: var(--background); border-radius: 5px; padding: 10px;">edit</span>
        <div id="infos" style="display: flex; gap: 15px; flex-direction: row; align-items: center;">
            <span id="construction" class="material-icons-outlined" style="background-color: var(--background); border-radius: 5px; padding: 10px; border: 2px solid transparent;">${this.symbolStatus}</span>
            <div id="text" style="display:flex; flex-direction:column;">
                <h3>${this.title}</h3>
                <h4 style="margin-right:10px;">${this.description}</h4>
            </div>
        </div>
        <div id="date">
            ${this.expiredate.toLocaleDateString('en-UK',{day: '2-digit',month: 'short',year: 'numeric' })}
        </div>`
        return this.ui
    }
    createUI(){
        if (this.ui && this.ui instanceof HTMLElement) {return}
        this.ui = document.createElement("div")
        this.templateUI()
        return this.ui
    }
}
