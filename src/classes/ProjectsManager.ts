import {IProject, Project} from './Project'

export class ProjectsManager {
    list: Project[] = []
    ui: HTMLDivElement
    defaultProject: IProject = { //default Project data
        acronym: 'SFH',
        name: 'Single Family House',
        address: 'None',
        status: 'Not started',
        cost: 0,
        progress: 100,
        companyName: 'University of Padua',
        projectType: 'Master degree thesis'
    }

    constructor(container:HTMLDivElement){
        this.ui = container
        this.newProject(this.defaultProject)
        this.setUI_projectsCount()
    }

    newProject(data: IProject){
        const project = new Project(data)
        const projectsNameList = this.list.map((project) => {return project.name})
        const nameInUse = projectsNameList.includes(data.name)
        const projectsAcronymList = this.list.map((project) => {return project.acronym})
        const acronymInUse = projectsAcronymList.includes(data.acronym)
        
        if (nameInUse && acronymInUse){
            throw new Error(`
            A project with the name "${data.name}" already exists.
            A project with the acronym "${data.acronym}" already exists.`)
        }
        if (nameInUse){
            throw new Error(`A project with the name "${data.name}" already exists.`)
        }
        if (acronymInUse){
            throw new Error(`A project with the acronym "${data.acronym}" already exists.`)
        }

        project.ui.addEventListener('click', () => {
            const pageProjects = document.getElementById('project-main-page') as HTMLElement //projects page
            const pageSingleProject = document.getElementById('single-project-page') as HTMLElement //single project page
            
            pageProjects.style.display = ""
            pageSingleProject.style.display = "none"
            //aggiungere per andare nella pagina del progetto singolo
        })

        this.ui.append(project.ui)
        this.list.push(project)

        this.setUI_projectsCount()
        return project
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
            project.name === name
        }) 
        return project
    }
    
    deleteProject (id: string) {
        const project = this.getProject(id)
        if (!project) {return}
        project.ui.remove()
        const remaining = this.list.filter((project) => {
            return project.id !== id
        })
        this.list = remaining
    }

    setUI_error(err:Error,disp:string,category:string='none'){
        const ui_errorNewProject = document.getElementById('new-project-error-tab') as HTMLElement
        ui_errorNewProject.style.display = disp
        ui_errorNewProject.innerHTML = `
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
            const projects: IProject[] = JSON.parse(json as string)
            const usedNames = new Array()
            for (const project of projects)
                try {
                    this.newProject(project)
                } catch (error) {
                    usedNames.push(project.name)
                }
            if (usedNames) {
                //alert(`These names are already in use:\n${usedNames.join('\n')}.\nThese projects will not be imported`)
                const d = document.getElementById('error-import-project') as HTMLDialogElement
                d.innerHTML = `
                    <h2 style="border-bottom: 2px solid black; padding: 20px;">WARNING !</h2>
                    <div style="white-space:pre-line; padding: 20px;">These names are already in use:\n
                    - ${usedNames.join('\n- ')}
                    \nThese projects will not be imported.
                    </div>
                    <h5 style="text-align: center; padding: 10px; border-top: 2px solid black;">Press ESC to exit</h5>`
                d.showModal()
            }
        })
    }
}