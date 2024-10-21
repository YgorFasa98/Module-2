import {v4 as uuidv4} from 'uuid'
import { ToDo } from './Todo'

export type status = 'Active' | 'Not started' | 'Completed' | 'Stopped' | 'Dismissed'

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
    //uiButtons: HTMLLIElement
    id: string

    constructor(data: IProject) {
        this.id = uuidv4()
        //Project data definition
        for (const key in data) {
            this[key] = data[key]
        }
    }

    /*
    templateUI_buttons(){
        this.uiButtons.className = 'single-project-button'
        this.uiButtons.innerHTML=`
        <p data-project-details-info="acronym" style="background-color: ${this.color};">${this.acronym}</p>
        <div>${this.name}</div>
        `
    }
        */

    //method for the UI card html creation
    /*
    createUI() {
        if (this.uiButtons && this.uiButtons instanceof HTMLElement) {return}
        this.uiButtons = document.createElement("li")
        this.templateUI_buttons()
    }
        */
}