import { IProject, Project, status } from './Project'
import { toggleModal } from './Generic'
import { ITodo, ToDo, priorityTodo, statusTodo } from './Todo'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export class ProjectsManager {
    list: Project[] = []
    onProjectCreated = (project: Project) => {} //custom event
    onProjectDeleted = (project: Project) => {}
    onProjectUpdated = (project: Project) => {}
    onSidebarButtons = (project: Project) => {}
    onProjectsCardsUpdate = (project: Project) => {}

    defaultToDoList: ToDo[] = [ //default todo list
        new ToDo({
            title: 'Default todo title',
            description: 'Default todo description',
            expiredate: new Date('12-3-2014'),
            status: 'Active',
            priority: 'Very high'
        }),
        new ToDo({
            title: 'Default todo title 2',
            description: 'Default todo description 2',
            expiredate: new Date('8-7-2019'),
            status: 'Closed',
            priority: 'High'
        })
    ]

    defaultProject: IProject = { //default Project data
        type: 'project',
        color: '#931f1f',
        acronym: 'SFH',
        name: 'Single Family House',
        address: 'None',
        status: 'Completed',
        cost: 1000,
        progress: 100,
        companyName: 'University of Padua',
        projectType: 'Master degree thesis',
        todoList: this.defaultToDoList
    }

    //INTERNAL PROPERTIES to manage projects and todos

    /*constructor(){
        this.newProject(this.defaultProject)
    }*/

    //NEW PROJECT METHOD
    newProject(data:IProject, id?:string){
        const project = new Project(data, id)
        const projectsNameList = this.list.map((project) => {return project.name})
        const nameInUse = projectsNameList.includes(data.name)
        const nameLength = data.name.length < 5
        const projectsAcronymList = this.list.map((project) => {return project.acronym})
        const acronymInUse = projectsAcronymList.includes(data.acronym)
        
        if (nameInUse || nameLength || acronymInUse){
            const errName = nameInUse ? `<br><br>- A project with the name "${data.name}" already exists.` : ''
            const errNameLength = nameLength ? '<br><br>- The length of the name is less than 5 characters.' : ''
            const errAcronym = acronymInUse ? `<br><br>- A project with the acronym "${data.acronym}" already exists.` : ''
            const errors = [errName,errNameLength,errAcronym]
            const joinedErrors = errors.join('')
            throw new Error(`\n${joinedErrors}`)
        }

        this.list.push(project)
        this.onProjectCreated(project)
        this.onSidebarButtons(project)

        return project
    }

    updateProject (data:IProject, id:string) {
        let project = this.getProject(id)
        if (!project) {return}
        project.type = data.type
        project.color = data.color
        project.acronym = data.acronym
        project.name = data.name
        project.address = data.address
        project.status = data.status
        project.cost = data.cost
        project.progress = data.progress
        project.companyName = data.companyName
        project.projectType = data.projectType
        project.todoList = data.todoList
        this.onProjectUpdated(project)
        this.onSidebarButtons(project)
        this.onProjectsCardsUpdate(project)
        return project
    }

    searchProject (value:string) {
        const projectsListFiltered = this.list.filter((project) => {
            return project.name.toLowerCase().includes(value)
        })
        return projectsListFiltered
    }

    //METHODS
    setUI_projectsCount(){
        const ui_projectsCount = document.getElementById('ProjectsTitle') as HTMLElement
        ui_projectsCount.innerHTML = `
        Projects (${this.list.length})`
    }

    getProject (id:string) {
        const project = this.list.find((project) => {
            return project.id === id
        })
        return project
    }
    
    deleteProject (id: string) {
        const project = this.getProject(id)
        if (!project) {return}
        const remaining = this.list.filter((project) => {
            return project.id !== id
        })
        this.list = remaining
        this.onProjectDeleted(project)
    }

    setUI_error(err:Error,disp:string,page:string){
        if (page=='new'){
            const ui_error = document.getElementById('new-project-error-tab') as HTMLElement
            ui_error.style.display = disp
            ui_error.innerHTML = `
            <h2>WARNING !</h2>
            <h3 style="font-weight: normal; margin-top: 10px">${err}</h3>`
        }else if(page=='edit'){
            const ui_error = document.getElementById('edit-project-error-tab') as HTMLElement
            ui_error.style.display = disp
            ui_error.innerHTML = `
            <h2>WARNING !</h2>
            <h3 style="font-weight: normal; margin-top: 10px">${err}</h3>`
        }
    }

    newTodo (data:ITodo) {
        const date = data.expiredate
        data.expiredate = new Date(date)
        return new ToDo(data)
    }

    //IMPORT JSON
    importFromJSON (){
        //this import operate through the project ID, so it is possible to have multiple projects with same name, if they have different IDs
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
            const projects: Project[] = JSON.parse(json as string)
            const usedID = new Array()
            for (const project of projects){
                if (project.type == 'project') {
                    const projectsIdList = this.list.map((p) => {return p.id})
                    const IdInUse = projectsIdList.includes(project.id)
                    const importedTodoList = project.todoList
                    project.todoList = []
                    for (const todo of importedTodoList){
                        const newTodo = this.newTodo(todo)
                        newTodo.id = todo.id
                        project.todoList.push(newTodo)
                    }
                    if (IdInUse) {
                        this.updateProject(project, project.id)
                        usedID.push(project.name)
                    } else {
                        try{
                            this.newProject(project)
                        } catch (error) {
                            console.log('Error during import: ', error)
                        }
                    }
                }else{
                    const d = document.getElementById('error-import-project') as HTMLDialogElement
                    d.innerHTML = `
                        <h2 style="border-bottom: 2px solid black; padding: 20px;">WARNING !</h2>
                        <div style="white-space:pre-line; padding: 20px;">You are not importing a projects file.</div>
                        <h5 style="text-align: center; padding: 10px; border-top: 2px solid black;">Press ESC to exit</h5>`
                    d.showModal()
                }
            }
            if (usedID.length > 0) {
                const d = document.getElementById('error-import-project') as HTMLDialogElement
                d.innerHTML = `
                    <h2 style="border-bottom: 2px solid black; padding: 20px;">WARNING !</h2>
                    <div style="white-space:pre-line; padding: 20px;">These imported projects has an ID already in use:\n
                    - ${usedID.join('\n- ')}
                    \nThese projects will be updated and the previous ones deleted.
                    </div>
                    <h5 style="text-align: center; padding: 10px; border-top: 2px solid black;">Press ESC to exit</h5>`
                d.showModal()
            }
        })
        console.log('lista fine import', this.list)
    }

    upload3DFile(){
        return new Promise((resolve) => {
            let mesh
            let fileName: string
            const input = document.createElement('input') //create an html element tag <input>
            input.type = 'file' //opens a window to select files from PC
            input.accept = '.gltf,.obj' //accept only .obj and .gltf files
            const reader = new FileReader()
            input.click()
            input.addEventListener('change', () => {
                const fileList = input.files
                if (!fileList) {return}
                reader.readAsText(fileList[0])
                fileName = fileList[0].name
            })
            reader.addEventListener('load', () => {
                const importedFile = reader.result
                if (!importedFile) {return}
                if (fileName.split('.').pop()=='gltf'){ //gltf file
                    const gltfLoader = new GLTFLoader()
                    mesh = gltfLoader.parse(importedFile as string,'',(mesh)=>{
                        resolve({mesh:mesh.scene, fileName:fileName})
                    })
                }else if (fileName.split('.').pop()=='obj'){ //obj file (only geometry not materials)
                    const objLoader = new OBJLoader()
                    mesh = objLoader.parse(importedFile as string)
                    resolve({mesh:mesh, fileName:fileName})
                }
            })
        })
    }
}