import {v4 as uuidv4} from 'uuid'

export type status = 'Active' | 'Not started' | 'Completed' | 'Stopped' | 'Dismissed'
export type statusTodo = 'Active' | 'Pause' | 'Resolved' | 'Closed'
export type priority = 'Low' | 'Medium' | 'High' | 'Very high'

export interface IProject {
    type: string
    color: string
    acronym: string
    name: string
    address: string
    status: status
    cost: number
    progress: number
    companyName: string
    projectType: string
    todoList: ToDo[]
}

export interface ITodo{
    title: string
    description: string
    expiredate: Date
    status: statusTodo
    priority: priority
}

//Todo class
export class ToDo implements ITodo{
    title: string
    description: string
    expiredate: Date
    status: statusTodo
    priority: priority

    colorStatus: string = '#931f1f'
    symbolStatus: string
    colorPriority: string = '#931f1f'

    uiTodo: HTMLElement

    constructor(data:ITodo){
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

        this.uiTodo.className = 'to-do-card'
        this.uiTodo.style.backgroundColor = this.colorPriority
        this.uiTodo.innerHTML = `
        <div style="display: flex; gap: 15px; flex-direction: row; align-items: center;">
            <span id="construction" class="material-icons-outlined" style="background-color: gray; border-radius: 5px; padding: 10px;">${this.symbolStatus}</span>
            <div style="display:flex; flex-direction:column;">
                <h3>${this.title}</h3>
                <h4 style="margin-right:10px;">${this.description}</h4>
            </div>
        </div>
        <div>
            ${this.expiredate.toLocaleDateString('en-UK',{day: '2-digit',month: 'short',year: 'numeric' })}
        </div>`
    }
    createUI(){
        if (this.uiTodo && this.uiTodo instanceof HTMLElement) {return}
        this.uiTodo = document.createElement("div")
        this.templateUI()
    }
}

//Project class
export class Project implements IProject{
    type: string = 'project'
    color: string = '#931f1f'
    acronym: string
    name: string
    address: string
    status: status
    cost: number
    progress: number
    companyName: string
    projectType: string
    todoList: ToDo[] = []

    //internal class properties
    ui: HTMLDivElement
    uiButtons: HTMLLIElement
    uiTodo: HTMLDivElement
    id: string

    constructor(data: IProject) {
        this.id = uuidv4()
        //Project data definition
        for (const key in data) {
            this[key] = data[key]
        }
        //method invoked for card UI
        this.createUI()
    }

    newTodo(data:ITodo){
        const todo = new ToDo(data)
        this.todoList.push(todo)
    }

    //template for user UI cards
    templateUI(){
        this.ui.className = "project-card"
        this.ui.innerHTML = `
        <div class="cards-header">
            <p style="background-color: ${this.color}; border-radius: 5px; padding: 15px;">${this.acronym}</p>
            <div>
                <h2>${this.name}</h2>
                <h4 style="color: rgb(172, 172, 172);">${this.address}</h4>
            </div>
        </div>
        <div class="cards-content">
            <div class="cards-property">
                <p class="cards-categories">Project type</p>
                <p>${this.projectType}</p>
            </div>
            <div class="cards-property">
                <p class="cards-categories">Company name</p>
                <p>${this.companyName}</p>
            </div>
            <div class="cards-property">
                <p class="cards-categories">Cost</p>
                <p>€ ${this.cost}</p>
            </div>
            <div class="cards-property">
                <p class="cards-categories">Status</p>
                <p>${this.status}</p>
            </div>
            <div class="cards-property">
                <p class="cards-categories">Progress</p>
                <p>${this.progress} %</p>
            </div>
        </div>`
    }

    templateUI_buttons(){
        this.uiButtons.className = 'single-project-button'
        this.uiButtons.innerHTML=`
        <p data-project-details-info="acronym" style="background-color: ${this.color};">${this.acronym}</p>
        <div>${this.name}</div>
        `
    }

    //method for the UI card html creation
    createUI() {
        if (this.ui && this.ui instanceof HTMLElement) {return}
        this.ui = document.createElement("div")
        this.templateUI()
        if (this.uiButtons && this.uiButtons instanceof HTMLElement) {return}
        this.uiButtons = document.createElement("li")
        this.templateUI_buttons()
    }
}