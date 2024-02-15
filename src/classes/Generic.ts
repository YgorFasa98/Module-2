import {IUser} from './User'
import { UsersManager } from './UsersManager'

//Modal class
export class toggleModal{
    m
    //constructor
    constructor (id: string){
        this.m = document.getElementById(id)
    }
    //method to show modal
    showModal (){
        if (this.m && this.m instanceof HTMLDialogElement) {
            this.m.showModal()     
        } else {
            console.warn('New user modal was not found')
        }
    }
    //method to close modal
    closeModal (){
        if (this.m && this.m instanceof HTMLDialogElement) {
            this.m.close()
        } else {
            console.warn('New user modal was not found')
        }
    }
    preventEsc(){
        this.m.addEventListener('keydown', (e) => {
            if (e.key ==='Escape'){
                e.preventDefault()
            }
        })
    }
}

export function exportToJSON (list, fileName: string = 'downloaded_list') {
    const json = JSON.stringify(list, null, 2)
    const blob = new Blob([json], {type: 'application/json'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.click()
    URL.revokeObjectURL(url)
}