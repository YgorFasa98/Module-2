import {v4 as uuidv4} from 'uuid'

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
}

//User class
export class Project implements IProject{
    type: string = 'project'
    color: string = 'brown'
    acronym: string
    name: string
    address: string
    status: status
    cost: number
    progress: number
    companyName: string
    projectType: string

    //internal class properties
    ui: HTMLDivElement
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

    //method for the UI card html creation
    createUI() {
        if (this.ui && this.ui instanceof HTMLElement) {return}
        this.ui = document.createElement("div")
        this.templateUI()
    }
}