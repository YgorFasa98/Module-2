import {IUser, User} from './User'

export class UsersManager {
    list: User[] = []
    /*defaultUser: IUser = { //default user data
        type: "user",
        name: 'Ygor Fasanella',
        email: 'ygor.fasanella@unipd.it',
        role: 'BIM manager',
        selfDescription: 'PhD student ad University of Padua and student of BIM software developer master. Be free again!',
        gender: 'Male',
        birthday: new Date('1998-12-10T23:00:00.000Z'),
        address: 'Via Sambughè, TV',
        companyName: 'University of Padua',
        userImage: 'assets/user1.png'
    }*/

    onUserCreated = (user:User) => {}
    onUserUpdated = (user:User) => {}
    onUserDeleted = (id:string) => {}
    onSingleUserCardChange = (user:User) => {}

    /*constructor(){
        this.newUser(this.defaultUser)
    }*/

    newUser(data: IUser, id? :string){
        const user = new User(data, id)
        const usersNameList = this.list.map((user) => {return user.name})
        const nameInUse = usersNameList.includes(data.name)
        if (nameInUse){
            throw new Error(`A user with the name "${data.name}" already exists.`)
        }
        if (isNaN(user.birthday as unknown as number)) {
            user.birthday = new Date('1-1-1801')
        }

        this.list.push(user)
        this.onUserCreated(user)

        return user
    }

    updateUser(data:IUser, id:string){
        let user = this.getUser(id)
        if (!user) {return}
        for (const key in user) {
            user[key] = data[key]
        }
        user.id = id
        user.cardVersion = 'compact'
        return user
    }

    searchUser(value:string){
        const usersListFiltered = this.list.filter((user) => {
            return user.name.toLowerCase().includes(value)
        })
        return usersListFiltered
    }
    
    updateUserUI(user:User){
        this.onSingleUserCardChange(user)
    }

    getUser (id:string) {
        const user = this.list.find((user) => {
            return user.id === id
        })
        return user
    }

    getUserByName (name:string) {
        const user = this.list.find((user) => {
            user.name === name
        }) 
        return user
    }
    
    deleteUser (id: string) {
        const user = this.getUser(id)
        if (!user) {return}
        const remaining = this.list.filter((user) => {
            return user.id !== id
        })
        this.list = remaining
        this.onUserDeleted(id)
    }

    meanUsersAge (){
        const i = 0
        const today = new Date()
        const totAge = this.list.reduce((c,user) => c + (today.getFullYear() - user.birthday.getFullYear()), i)
        const meanAge = totAge/this.list.length
        return meanAge.toFixed(2)
    }
    
    setUI_meanAge() {
        const ui_meanAge = document.getElementById('meanAge') as HTMLDivElement
        ui_meanAge.innerHTML = `
        <h3 style="font-weight: normal;">Users mean age: ${this.meanUsersAge()} years<h3S>`
    }

    setUI_usersCount(){
        const ui_usersCount = document.getElementById('manageUsersTitle') as HTMLElement
        ui_usersCount.innerHTML = `
        Manage Users (${this.list.length})`
    }

    setUI_error(err:Error,disp:string,category:string='none'){
        const ui_errorNewUser = document.getElementById('new-user-error-tab') as HTMLElement
        ui_errorNewUser.style.display = disp
        ui_errorNewUser.innerHTML = `
        <h2>WARNING !</h2>
        <h3 style="font-weight: normal; margin-top: 10px">${err}</h3>`
    }

    importFromJSON (){
        const input = document.createElement('input') //create an html element tag <input>
        input.type = 'file' //in this way opens a window to select files from PC
        input.accept = 'application/json' //accept only json files

        const reader = new FileReader()

        input.click()

        input.addEventListener('change', () => {
            const fileList = input.files
            if (!fileList) {return}
            reader.readAsText(fileList[0])
        })

        reader.addEventListener("load", () => {
            const json = reader.result
            if (!json) {return}
            const users: IUser[] = JSON.parse(json as string)
            const usedNames = new Array()
            for (const user of users)
                if (user.type=='user') {
                    try {
                        if (user.birthday==null) {user.birthday = new Date('')} //if there is a user with the birthday date exported as invalid date (null value)
                        else {user.birthday = new Date(user.birthday)} //needs to recreate the date from the string, although it create an error
                        this.newUser(user)
                    } catch (error) {
                        usedNames.push(user.name)
                    }
                }
            if (usedNames.length==0) {
                const d = document.getElementById('error-import-user') as HTMLDialogElement
                d.innerHTML = `
                    <h2 style="border-bottom: 2px solid black; padding: 20px;">WARNING !</h2>
                    <div style="white-space:pre-line; padding: 20px;">You are not importing a users file.</div>
                    <h5 style="text-align: center; padding: 10px; border-top: 2px solid black;">Press ESC to exit</h5>`
                d.showModal()
            }else{
                const d = document.getElementById('error-import-user') as HTMLDialogElement
                d.innerHTML = `
                    <h2 style="border-bottom: 2px solid black; padding: 20px;">WARNING !</h2>
                    <div style="white-space:pre-line; padding: 20px;">These names are already in use:\n
                    - ${usedNames.join('\n- ')}
                    \nThese users will not be imported.
                    </div>
                    <h5 style="text-align: center; padding: 10px; border-top: 2px solid black;">Press ESC to exit</h5>`
                d.showModal()
            }
        })
    }
}