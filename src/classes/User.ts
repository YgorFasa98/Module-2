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
    birthday: Date = new Date('1-1-1901')
    address: string
    companyName: string
    userImage: string = 'assets/genericUser.jpg'

    //internal class properties
    id: string
    cardVersion: string = 'compact'
    
    constructor(data: IUser, id = uuidv4(), expanded: boolean = false) {
        //User data definition
        for (const key in data) {
            this[key] = data[key]
        }
        this.id = id
    }
}