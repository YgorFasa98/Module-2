import {v4 as uuidv4} from 'uuid'

export type role = 'Engineer' | 'Architect' | 'BIM manager' | 'BIM coordinator' | 'BIM specialist'
export type gender = 'Male' | 'Female' | 'Other'

export interface IUser {
    type: string
    name: string 
    email: string
    role: role
    selfDescription: string
    gender: gender
    birthday: Date
    address: string
    companyName: string
    userImage: string
}

//User class
export class User implements IUser{
    //interface properties
    type: string = 'user'
    name: string
    email: string
    role: role
    selfDescription: string
    gender: gender
    birthday: Date
    address: string
    companyName: string
    userImage: string = 'assets/genericUser.jpg'

    //internal class properties
    ui: HTMLLIElement
    id: string

    constructor(data: IUser, expanded: boolean = false) {

        this.id = uuidv4()
        
        //Project data definition
        for (const key in data) {
            this[key] = data[key]
        }
        //this.name = data.name
        //this.email = data.email
        //this.role = data.role
        //this.selfDescription = data.selfDescription
        //this.gender = data.gender
        //this.birthday = data.birthday
        //this.address = data.address
        //this.companyName = data.companyName
        //this.userImage = data.userImage

        //method invoked for card UI
        if (expanded) {this.createUI_expandedUser()}
        else {this.createUI_compactUser()}
        //this.setUI_expandedUser()
        //this.setUI_compactUser()
    }

    //template for user UI cards
    templateUI_compactUser(){
        this.ui.id = 'user-card-compact-id'
        this.ui.className = "user-card"
        this.ui.innerHTML = `
        <div id="user-compact">
            <div class="user-image" style="background-image: url('${this.userImage}');"></div>
            <p>${this.name}</p>
            <p>${this.email}</p>
            <p>${this.role}</p>
            <span id="expand_more" style="margin-left: 10px; padding: 10px;" class="material-icons-outlined">expand_more</span>
        </div>`
    }

    templateUI_expandedUser(){
        this.ui.id = 'user-card-expanded-id'
        this.ui.className = "user-card user-card-expanded"
        this.ui.innerHTML = `
        <div id="user-compact">
            <div class="user-image" style="background-image: url('${this.userImage}');"></div>
            <p>${this.name}</p>
            <p>${this.email}</p>
            <p>${this.role}</p>
            <span id="expand_more" style="margin-left: 10px; padding: 10px;" class="material-icons-outlined">expand_less</span>
        </div>
        <div id="users-details">
            <div style="display: grid; grid-template-columns: 250px 1fr; padding-right: 20px;">
                <p style="color: gray;">Description</p>
                <p>${this.selfDescription}</p>
            </div>
            <div style="display: grid; grid-template-columns: 250px 1fr; padding-right: 20px;">
                <p style="color: gray;">Gender</p>
                <p>${this.gender}</p>
            </div>
            <div style="display: grid; grid-template-columns: 250px 1fr; padding-right: 20px;">
                <p style="color: gray;">Birthday date</p>
                <p>${this.birthday.toLocaleDateString('en-UK',{day: '2-digit',month: 'long',year: 'numeric' })}</p>
            </div>
            <div style="display: grid; grid-template-columns: 250px 1fr; padding-right: 20px;">
                <p style="color: gray;">Address</p>
                <p>${this.address}</p>
            </div>
            <div style="display: grid; grid-template-columns: 250px 1fr; padding-right: 20px;">
                <p style="color: gray;">Company name</p>
                <p>${this.companyName}</p>
            </div>
        </div>`
    }

    //method for the UI card html creation
    createUI_expandedUser() {
        if (this.ui && this.ui instanceof HTMLElement) {return}
        this.ui = document.createElement("li")
        this.templateUI_expandedUser()
    }
    createUI_compactUser() {
        if (this.ui  && this.ui instanceof HTMLElement) {return}
        this.ui = document.createElement("li")
        this.templateUI_compactUser()
    }

    changeUI(id:string){
        if (id == 'user-card-compact-id'){
            this.templateUI_expandedUser()
        }
        if (id == 'user-card-expanded-id'){
            this.templateUI_compactUser()
        }
    }
}