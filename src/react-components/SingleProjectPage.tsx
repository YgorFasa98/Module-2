import * as React from 'react'
import * as Router from 'react-router-dom'
import { ProjectsManager } from '../classes/ProjectsManager'
import * as P from '../classes/Project'
import * as T from '../classes/Todo'
import { toggleModal } from '../classes/Generic'
import { SingleProjectDetails } from './SingleProjectDetails'
import { ProgressBar } from './ProgressBar'
import { ProjectButton } from './ProjectButton'
import { EditProjectForm } from './EditProjectForm'
import { ToDoCard } from './ToDoCard'
import { SearchBar } from './SearchBar'
import { ThreeViewer } from './ThreeViewer'
import { deleteDocument, updateDocument } from '../firebase'

interface Props {
    projectsManager: ProjectsManager
}

export function SingleProjectPage (props:Props) {
    const routeParams = Router.useParams<{id: string}>()
    if(!routeParams.id){
        alert('ID not found')
        return (<div id="single-project-page" className="page">ID not found</div>)
    }

    const p = props.projectsManager.getProject(routeParams.id)
    if (!p) {return}
    const [project, updateProject] = React.useState<P.Project>(p)
    const [todos, setTodos] = React.useState<T.ToDo[]>(project.todoList)

    if (!(project && project instanceof P.Project)){
        alert('Project not found')
        return (<div id="single-project-page" className="page">Project not found</div>)
    }
     //in the new row is needed a new instance of project otherwise: first reason will not enter the effect and do not update the page
     //and then it will be a simple object and won't pass the if statement above
    props.projectsManager.onProjectUpdated = () => {onUpdateSingleProjectPageUI(p)}

    const navigateTo = Router.useNavigate()        
    props.projectsManager.onProjectDeleted = async (id) => { //this event is activated within project manager delete method executing the steps here
        await deleteDocument('/projects', id) //function to delete doc in firestore
        navigateTo('/home') //return to home WAITING deleting is completed
    }
    
    const ToDoCardsList = todos.map((todo) => {return <ToDoCard todo={todo} project={project} projectManager={props.projectsManager} key={todo.id}/>})

    React.useEffect(() => {
        onUpdateSingleProjectPageUI(p)
      }, [routeParams.id])

    //#region EVENTS
    const onUpdateSingleProjectPageUI = (project:P.Project) => {
        updateProject(new P.Project(project, routeParams.id)) //hook to update the project state of this component
        setTodos(project.todoList)
    }

    const onDeleteProjectButtonClick = (id:string) => { //event on click mouse
        props.projectsManager.deleteProject(id) //the event activates the method in project manager which activate: 1. the method above and 2. delete project from project manager list
    }

    const SingleProjectDetailsComp = <SingleProjectDetails project={project} deleteEvent={onDeleteProjectButtonClick} key={project.id}/>

    const onEditProjectFormSaveButtonClick = async (e: React.FormEvent) => {
        const editProjectForm = document.getElementById("edit-project-form") //form element       
        const editProjectModal = new toggleModal('edit-project-modal')
        if (editProjectForm && editProjectForm instanceof HTMLFormElement) { //check the existance of user form
            const formData = new FormData(editProjectForm)
            e.preventDefault()
            const projectData: P.IProject = { //store data in this dictionary
                type: 'project',
                color: formData.get('color') as string,
                name: formData.get('name') as string,
                address: formData.get('address') as string,
                companyName: formData.get('companyName') as string,
                acronym: formData.get('acronym') as string,
                status: formData.get('status') as P.status,
                cost: formData.get('cost') as unknown as number,
                progress: formData.get('progress') as unknown as number,
                projectType: formData.get('projectType') as string,
                todoList: project.todoList
            }
            try {
                await updateDocument<Partial<P.IProject>>('/projects', project.id, projectData)
                props.projectsManager.updateProject(projectData, project.id)
                editProjectModal.closeModal() //if i want to close or not the form after clicking on accept button
                editProjectForm.reset() //reset the fields of the form
                props.projectsManager.setUI_error(new Error(''),"none",'edit') //display the UI of error
            } catch (err) {
                props.projectsManager.setUI_error(err,"",'edit')
            }
        } else {console.warn("Edit project form was not found")}
    }
    const onEditProjectForm = <EditProjectForm project={project} onEditProjectFormSaveButtonClick={onEditProjectFormSaveButtonClick} key={project.id}/>


    //TODO
    const onNewTodoButtonClick = () =>{
        const newTodoModal = new toggleModal('new-todo-modal') //new project modal
        if (newTodoModal) {
          newTodoModal.showModal()
        } else {
          console.warn("New todo modal was not found")
        }
    }

    const onNewTodoFormSaveButtonClick = (e: React.FormEvent) =>{
        const newTodoModal = new toggleModal('new-todo-modal') //new project modal
        const newTodoForm = document.getElementById("new-todo-form") //form element
        if (newTodoForm && newTodoForm instanceof HTMLFormElement){
            const formData = new FormData(newTodoForm)
            e.preventDefault()
            const todoData: T.ITodo = {
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                expiredate: new Date (formData.get('expiredate') as string),
                status: formData.get('status') as T.statusTodo,
                priority: formData.get('priority') as T.priorityTodo,
            }
            try {
                const t = props.projectsManager.newTodo(todoData)
                p.todoList.push(t)
                onUpdateSingleProjectPageUI(p)
                newTodoModal.closeModal() //if i want to close or not the form after clicking on accept button
                newTodoForm.reset() //reset the fields of the form
                props.projectsManager.setUI_error(new Error(''),"none",'new') //display the UI of error
            } catch (err) {
                console.log(err)
                //projectsManager.setUI_error(err,"",'new')
            }
        }
    }

    const onNewTodoFormCancelButtonClick = (e: React.FormEvent) => {
        const newTodoModal = new toggleModal('new-todo-modal') //new project modal
        const newTodoForm = document.getElementById("new-todo-form") //form element
        if (newTodoForm && newTodoForm instanceof HTMLFormElement){
            e.preventDefault()
            try {
                newTodoModal.closeModal() //if i want to close or not the form after clicking on accept button
                newTodoForm.reset() //reset the fields of the form
            } catch (err) {
                console.log(err)
                //projectsManager.setUI_error(err,"",'new')
            }
        }
    }

    const onTodoSearch = (value:string) => {
        const listTodoFiltered = project.todoList.filter((todo) => {
            return todo.title.toLowerCase().includes(value)
        })
        setTodos(listTodoFiltered)
    }
    //#endregion

    return(
        <div id="single-project-page" className="page">
            {onEditProjectForm}
            <dialog id="new-todo-modal">
                <div id="new-todo-dialog">
                <form id="new-todo-form">
                    <h2>New To-Do</h2>
                    <div className="input-list">
                    <div className="field-container">
                        <label className="field-title">
                        <span className="material-symbols-outlined form-icons">
                            location_away
                        </span>
                        Title
                        </label>
                        <input name="title" type="text" />
                    </div>
                    <div className="field-container" style={{ marginLeft: 25 }}>
                        <label className="field-title">
                        <span className="material-icons-outlined form-icons">menu</span>
                        Description
                        </label>
                        <textarea
                        name="description"
                        cols={30}
                        rows={5}
                        placeholder=" Introduct yourself (max 300 characters)..."
                        style={{ resize: "none" }}
                        maxLength={300}
                        defaultValue={""}
                        />
                    </div>
                    <div className="field-container" style={{ marginLeft: 25 }}>
                        <label className="field-title">
                        <span className="material-icons-outlined form-icons">event</span>
                        Expire date
                        </label>
                        <input name="expiredate" type="date" className="date" />
                    </div>
                    <div className="field-container" style={{ marginLeft: 25 }}>
                        <label className="field-title">
                        <span className="material-icons-outlined form-icons">update</span>
                        Status
                        </label>
                        <select name="status">
                        <option>Active</option>
                        <option>Pause</option>
                        <option>Resolved</option>
                        <option>Closed</option>
                        </select>
                    </div>
                    <div className="field-container" style={{ marginLeft: 25 }}>
                        <label className="field-title">
                        <span className="material-icons-outlined form-icons">update</span>
                        Priority
                        </label>
                        <select name="priority">
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                        <option>Very high</option>
                        </select>
                    </div>
                    </div>
                    <div className="buttons">
                    <button
                        type="button"
                        id="button-todo-form-cancel"
                        className="generic-buttons"
                        onClick={onNewTodoFormCancelButtonClick}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        id="button-todo-form-accept"
                        className="generic-buttons"
                        onClick={onNewTodoFormSaveButtonClick}
                    >
                        Accept
                    </button>
                    </div>
                </form>
                <div id="new-project-error-tab" style={{ display: "none" }} />
                </div>
            </dialog>
            <header className="single-project-page-spaces">
                <h1 data-project-details-info="title-name">{project.name}</h1>
                <h4
                style={{ color: "rgb(115, 115, 115)" }}
                data-project-details-info="title-address"
                >
                {project.address}
                </h4>
            </header>
            <div className="main-page-content">
                <div
                id="sx-bar"
                className="single-project-page-spaces"
                style={{ padding: 0, backgroundColor: "transparent", gap: 10 }}
                >
                {SingleProjectDetailsComp}
                <div
                    className="single-project-page-spaces todo-list"
                    style={{ flexGrow: 1, margin: 0, rowGap: 20 }}
                >
                    <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between"
                    }}
                    >
                    <h2>To-Do</h2>
                    <div
                        style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 5
                        }}
                    >
                        <span
                        id="todo-search"
                        className="material-icons-outlined generic-buttons"
                        >
                        search
                        </span>
                        <SearchBar onChange={onTodoSearch} searchBy='todo title'/>
                        <span
                        id="todo-add"
                        className="material-icons-outlined generic-buttons"
                        onClick={onNewTodoButtonClick}
                        >
                        add
                        </span>
                    </div>
                    </div>
                    {
                    todos.length > 0 ? 
                    <div
                    id="todo-card-list"
                    className="card-list"
                    style={{
                        margin: 0,
                        overflowY: "auto",
                        height: 100,
                        display: "flex",
                        flexDirection: "column",
                        rowGap: 20,
                        flexGrow: 1
                    }}
                    >
                        {ToDoCardsList}
                    </div> : <p style={{display:'flex', flexDirection:'column', fontSize:'20px', alignItems:'center'}}>Any todo found!</p>
                    }
                </div>
                </div>
                <div
                id="bow-viewer"
                className="single-project-page-spaces viewer-container"
                >
                <ul
                    id="viewer-bar"
                    style={{ padding: 5, borderRight: "2px solid black" }}
                >
                    <li
                    id="3D-file-upload"
                    className="generic-buttons"
                    style={{ textAlign: "center" }}
                    >
                    <span className="material-icons-outlined">upload</span>
                    <h5>OBJ</h5>
                    <h5>GLTF</h5>
                    </li>
                </ul>
                <ThreeViewer projectsManager={props.projectsManager}/>
                </div>
            </div>
        </div>
    )
}