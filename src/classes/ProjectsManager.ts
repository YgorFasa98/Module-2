import { IProject, Project, status } from './Project'
import { toggleModal } from './Generic'
import { ITodo, ToDo, priorityTodo, statusTodo } from './Todo'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export class ProjectsManager {
    list: Project[] = []
    //ui: HTMLDivElement
    //uiButtons: HTMLUListElement
    //uiTodo: HTMLDivElement
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
        todoList: []
    }

    //INTERNAL PROPERTIES to manage projects and todos
    oldProject: Project
    oldTodo: ToDo
    viewerContainer: HTMLElement

    //constructor(container:HTMLDivElement, containerButtons:HTMLUListElement, containerTodo:HTMLDivElement){
    constructor(){
        //this.ui = container
        //this.uiButtons = containerButtons
        //this.uiTodo = containerTodo
        //this.newProject(this.defaultProject)

        //#region TO REMOVE (programmatically enters the default project before the viewer is created)
        //This is needed because i don't set any event to load the viewer after the project card gets clicked
        //if the page is loaded in the home page infact the dom doesn't find the viewer container because it is hidden
        //so it's possible to show the viewer but I have before to resize the window
        //I have to find a way to do it automatically when the project ui card gets clicked
        const defProject = this.newProject(this.defaultProject)
        //defProject.ui.click()
        //#endregion

        //this.setUI_projectsCount()
    }

    //NEW PROJECT METHOD
    newProject(data: IProject,operation:string='new'){
        const project = new Project(data)
        const projectsNameList = this.list.map((project) => {return project.name})
        const nameInUse = projectsNameList.includes(data.name)
        const nameLength = data.name.length < 5
        const projectsAcronymList = this.list.map((project) => {return project.acronym})
        const acronymInUse = projectsAcronymList.includes(data.acronym)
        
        if (operation=='update'){
            if (nameLength){
                const errNameLength = nameLength ? '<br><br>- The length of the name is less than 5 characters.' : ''
                throw new Error(`\n${errNameLength}`)
            }
        } else {
            if (nameInUse || nameLength || acronymInUse){
                const errName = nameInUse ? `<br><br>- A project with the name "${data.name}" already exists.` : ''
                const errNameLength = nameLength ? '<br><br>- The length of the name is less than 5 characters.' : ''
                const errAcronym = acronymInUse ? `<br><br>- A project with the acronym "${data.acronym}" already exists.` : ''
                const errors = [errName,errNameLength,errAcronym]
                const joinedErrors = errors.join('')
                throw new Error(`\n${joinedErrors}`)
            }
        }

        /*
        project.uiButtons.addEventListener('click', () => {
            this.setProjectDetails(project)
            this.oldProject = project
        })
            */

        //this.ui.append(project.ui)
        //this.uiButtons.append(project.uiButtons)
        this.list.push(project)

        //this.setUI_projectsCount()
        return project
    }

    //METHOD TO SET PROJECT DETAILS PAGE
    
    setProjectDetails (project:Project) {
        //pages visibility to show project details page
        const pageProjects = document.getElementById('project-main-page') as HTMLElement //projects page
        const pageSingleProject = document.getElementById('single-project-page') as HTMLElement //single project page
        const projectDetailsButtons = document.getElementById('nav-buttons-projects') as HTMLElement
        pageProjects.style.display = "none"
        pageSingleProject.style.display = ""
        projectDetailsButtons.style.display = ""

        //update container to show the details of the selected project
        const title_name = pageSingleProject.querySelector("[data-project-details-info='title-name']") as HTMLElement
        const title_address = pageSingleProject.querySelector("[data-project-details-info='title-address']") as HTMLElement
        const name = pageSingleProject.querySelector("[data-project-details-info='name']") as HTMLElement
        const address = pageSingleProject.querySelector("[data-project-details-info='address']") as HTMLElement
        const acronym = pageSingleProject.querySelector("[data-project-details-info='acronym']") as HTMLElement
        const company = pageSingleProject.querySelector("[data-project-details-info='company']") as HTMLElement
        const projectType = pageSingleProject.querySelector("[data-project-details-info='project-type']") as HTMLElement
        const status = pageSingleProject.querySelector("[data-project-details-info='status']") as HTMLElement
        const cost = pageSingleProject.querySelector("[data-project-details-info='cost']") as HTMLElement
        const progress = pageSingleProject.querySelector("[data-project-details-info='progress']") as HTMLElement
        
        if (title_name && title_address && name && address && acronym && company && projectType && status && cost && progress){
        title_name.textContent = name.textContent = project.name
        title_address.textContent = address.textContent = project.address
        acronym.textContent = project.acronym
        acronym.style.backgroundColor = project.color
        company.textContent = project.companyName
        projectType.textContent = project.projectType
        status.textContent = project.status
        cost.textContent = `${project.cost as unknown as string} €`
        progress.textContent = `${project.progress as unknown as string}%`
        progress.style.width = `${project.progress as unknown as string}%`
        }

        const projectTodoCardsContainer = document.getElementById('todo-card-list') as HTMLDivElement
        projectTodoCardsContainer.innerHTML = ''
        for (const todo of project.todoList){
            const todoFly = new ToDo(todo)
            projectTodoCardsContainer.append(todoFly.ui)           
        }

        //set to the edit button the current project previously selected in the main page
        const editProjectButton = document.getElementById('edit-button')
        const editProjectModal = new toggleModal('edit-project-modal')
        const editProjectForm = document.getElementById("edit-project-form") //form element

        if (editProjectButton && editProjectForm && editProjectModal) {
            editProjectButton.addEventListener('click', () => {  //show modal of edit project
                const keys = ['acronym','color','name','projectType','address','companyName','status','cost','progress','progress-output']
                for (const key of keys){ //pre-compile del form with the infos of the opened project
                    const k = editProjectForm.querySelector(`[name=${key}]`) as any
                    k.value = key=='progress-output' ? project.progress : project[key]
                }
                editProjectModal.showModal() //show the form
                this.oldProject = project //set the active project as old to delete it
            })
        } else {console.warn("Edit project button was not found")}

        const todoAddButton = document.getElementById('todo-add') as HTMLElement
        if (todoAddButton){
            todoAddButton.addEventListener('click', () => {
                this.oldProject = project
            })
        }
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

    getProjectByName (name:string) {
        const project = this.list.find((project) => {
            return project.name === name
        }) 
        return project
    }
    
    deleteProject (id: string) {
        const project = this.getProject(id)
        if (!project) {return}
        //project.uiButtons.remove()
        const remaining = this.list.filter((project) => {
            return project.id !== id
        })
        this.list = remaining
    }

    updateProject (data:IProject) {
        data.todoList = this.oldProject.todoList
        this.deleteProject(this.oldProject.id)
        const project = this.newProject(data,'update')
        this.setProjectDetails(project)
    }

    updateProjectFromImport(data:IProject){
        const exProject = this.getProjectByName(data.name)
        if (exProject) {this.deleteProject(exProject.id)}
        return this.newProject(data,'update')
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

    //TODO
    newTodo(data:ITodo){
        const todo = new ToDo(data)
        this.oldProject.todoList.push(todo)
        todo.ui.addEventListener('mouseover', () => {
            const deleteButton = todo.ui.querySelector(`[id=deletetodo]`) as HTMLElement
            const editButton = todo.ui.querySelector(`[id=edittodo]`) as HTMLElement
            const date = todo.ui.querySelector(`[id=date]`) as HTMLElement
            const infos = todo.ui.querySelector(`[id=infos]`) as HTMLElement
            todo.ui.style.justifyContent = 'center'
            todo.ui.style.gap = '10px'
            if (deleteButton && editButton) {
                date.style.display = 'none'
                infos.style.display = 'none'
                deleteButton.style.display = ''
                editButton.style.display = ''

                editButton.addEventListener('click',()=>{
                    const updateTodoModal = new toggleModal('edit-todo-modal')
                    const updateTodoForm = document.getElementById('edit-todo-form') as HTMLFormElement
                    const statusForm = (updateTodoForm.querySelector(`[name=status]`) as any)
                    const priorityForm = (updateTodoForm.querySelector(`[name=priority]`) as any)
                    if (updateTodoForm && updateTodoModal){
                        statusForm.value = todo.status
                        priorityForm.value = todo.priority
                        this.oldTodo = todo
                        updateTodoModal.showModal()
                    }
                })
                deleteButton.addEventListener('click',()=>{
                    this.oldTodo = todo
                    this.deleteTodo()
                })
            }
        })
        todo.ui.addEventListener('mouseleave', () => {
            const deleteButton = todo.ui.querySelector(`[id=deletetodo]`) as HTMLElement
            const editButton = todo.ui.querySelector(`[id=edittodo]`) as HTMLElement
            const date = todo.ui.querySelector(`[id=date]`) as HTMLElement
            const infos = todo.ui.querySelector(`[id=infos]`) as HTMLElement
            todo.ui.style.justifyContent = 'space-between'
            if (deleteButton && editButton) {
                deleteButton.style.display = 'none'
                editButton.style.display = 'none'
                date.style.display = ''
                infos.style.display = 'flex'
            }
        })
        const projectTodoCardsContainer = document.getElementById('todo-card-list') as HTMLDivElement
        projectTodoCardsContainer.append(todo.ui)
    }
    
    updateTodo(newStatus:statusTodo,newPriority:priorityTodo){
        const projectTodoCardsContainer = document.getElementById('todo-card-list') as HTMLDivElement
        projectTodoCardsContainer.removeChild(this.oldTodo.ui)
        this.oldTodo.status = newStatus
        this.oldTodo.priority = newPriority
        const newUI = this.oldTodo.templateUI()
        projectTodoCardsContainer.append(newUI)
    }

    deleteTodo(){
        const projectTodoCardsContainer = document.getElementById('todo-card-list') as HTMLDivElement
        //projectTodoCardsContainer.removeChild(this.oldTodo.ui)
        const remaining = this.oldProject.todoList.filter((todo) => {
            return todo.id !== this.oldTodo.id
        })
        this.oldProject.todoList = remaining
        this.setProjectDetails(this.oldProject)
    }

    //IMPORT JSON
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
            const projects: IProject[] = JSON.parse(json as string)
            //console.log(projects)
            const usedNames = new Array()
            for (const project of projects)
                if (project.type == 'project') {
                    const todoList = project.todoList
                    project.todoList = []
                    try {
                        this.oldProject = this.newProject(project)
                        for (const todo of todoList){
                            if (todo.expiredate==null) {todo.expiredate = new Date('')} //if there is a user with the birthday date exported as invalid date (null value)
                            else {todo.expiredate = new Date(todo.expiredate)} //needs to recreate the date from the string, although it create an error
                            this.newTodo(todo)
                        }
                    } catch (error) {
                        this.oldProject = this.updateProjectFromImport(project)
                        for (const todo of todoList){
                            if (todo.expiredate==null) {todo.expiredate = new Date('')} //if there is a user with the birthday date exported as invalid date (null value)
                            else {todo.expiredate = new Date(todo.expiredate)} //needs to recreate the date from the string, although it create an error
                            this.newTodo(todo)
                        }
                        usedNames.push(project.name)
                    }
                }else{
                    const d = document.getElementById('error-import-project') as HTMLDialogElement
                    d.innerHTML = `
                        <h2 style="border-bottom: 2px solid black; padding: 20px;">WARNING !</h2>
                        <div style="white-space:pre-line; padding: 20px;">You are not importing a projects file.</div>
                        <h5 style="text-align: center; padding: 10px; border-top: 2px solid black;">Press ESC to exit</h5>`
                    d.showModal()
                }
            if (usedNames.length > 0) {
                //alert(`These names are already in use:\n${usedNames.join('\n')}.\nThese projects will not be imported`)
                const d = document.getElementById('error-import-project') as HTMLDialogElement
                d.innerHTML = `
                    <h2 style="border-bottom: 2px solid black; padding: 20px;">WARNING !</h2>
                    <div style="white-space:pre-line; padding: 20px;">These projects already exist:\n
                    - ${usedNames.join('\n- ')}
                    \nThese projects will be updated.
                    </div>
                    <h5 style="text-align: center; padding: 10px; border-top: 2px solid black;">Press ESC to exit</h5>`
                d.showModal()
            }
        })
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