import {IProject, ITodo, Project, ToDo, priority, status, statusTodo} from './Project'
import { toggleModal } from './Generic'

export class ProjectsManager {
    list: Project[] = []
    ui: HTMLDivElement
    uiButtons: HTMLUListElement
    uiTodo: HTMLDivElement
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
    oldProject: Project
    oldTodo: ToDo

    constructor(container:HTMLDivElement, containerButtons:HTMLUListElement, containerTodo:HTMLDivElement){
        this.ui = container
        this.uiButtons = containerButtons
        this.uiTodo = containerTodo
        this.newProject(this.defaultProject)
        this.setUI_projectsCount()
    }

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

        project.ui.addEventListener('click', () => {
            this.setProjectDetails(project)
        })
        project.uiButtons.addEventListener('click', () => {
            this.setProjectDetails(project)
        })

        this.ui.append(project.ui)
        this.uiButtons.append(project.uiButtons)
        this.list.push(project)

        this.setUI_projectsCount()
        return project
    }

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

        //forse qui va cambiata la creazione della UI perche cosi non è legata al project 
        //perchè modificando le todo importate ne crea di nuove invece di modificare le vecchie
        const projectTodoCardsContainer = document.getElementById('todo-card-list') as HTMLDivElement
        projectTodoCardsContainer.innerHTML = ''
        for (const todo of project.todoList){
            const todoFly = new ToDo(todo)
            todoFly.uiTodo.addEventListener('click',() => {
                this.oldProject = project
                this.oldTodo = todoFly
            })
            projectTodoCardsContainer.append(todoFly.uiTodo)           
        }
    }

    setUI_projectsCount(){
        const ui_projectsCount = document.getElementById('ProjectsTitle') as HTMLElement
        ui_projectsCount.innerHTML = `
        Projects (${this.list.length})`
    }

    //da modificare
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
        project.ui.remove()
        project.uiButtons.remove()
        const remaining = this.list.filter((project) => {
            return project.id !== id
        })
        this.list = remaining
    }

    updateProject (data:IProject) {
        const proj = new Project(data)
        proj.todoList = this.oldProject.todoList
        this.deleteProject(this.oldProject.id)
        this.newProject(proj,'update')
        this.setProjectDetails(proj)
    }

    updateProjectFromImport(data:IProject){
        const importedProject = new Project(data)
        const oldProject = this.getProjectByName(data.name)
        if (oldProject) {this.deleteProject(oldProject.id)}
        this.newProject(importedProject,'update')
    }

    updateTodo(statusNew:statusTodo,priorityNew:priority){
        const todoData: ITodo = {
            status: statusNew,
            priority: priorityNew,
            title: this.oldTodo.title,
            description: this.oldTodo.description,
            expiredate: this.oldTodo.expiredate
        }
        this.oldProject.deleteTodo(this.oldTodo.id)
        this.oldProject.newTodo(todoData)
        this.setProjectDetails(this.oldProject)       
    }

    newTodo (data:ITodo){
        const projectTodoCardsContainer = document.getElementById('todo-card-list') as HTMLDivElement
        const todoFly = this.oldProject.newTodo(data)
        projectTodoCardsContainer.append(todoFly.uiTodo)
        this.setProjectDetails(this.oldProject)
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
            console.log(projects)
            const usedNames = new Array()
            for (const project of projects)
                if (project.type == 'project') {
                    try {
                        for (const todo of project.todoList){
                            if (todo.expiredate==null) {todo.expiredate = new Date('')} //if there is a user with the birthday date exported as invalid date (null value)
                            else {todo.expiredate = new Date(todo.expiredate)} //needs to recreate the date from the string, although it create an error
                        }
                        this.newProject(project)
                    } catch (error) {
                        this.updateProjectFromImport(project)
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
}