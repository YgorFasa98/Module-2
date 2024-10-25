import * as React from 'react'
import * as Router from 'react-router-dom'
import { ProjectsManager } from '../classes/ProjectsManager'
import * as P from '../classes/Project'
import { toggleModal } from '../classes/Generic'
import { SingleProjectDetails } from './SingleProjectDetails'
import { ProgressBar } from './ProgressBar'
import { ProjectButton } from './ProjectButton'
import { EditProjectform } from './EditProjectForm'

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
    if (!(project && project instanceof P.Project)){
        alert('Project not found')
        return (<div id="single-project-page" className="page">Project not found</div>)
    }
     //in the new row is needed a new instance of project otherwise: first reason will not enter the effect and do not update the page
     //and then it will be a simple object and won't pass the if statement above
    props.projectsManager.onProjectUpdated = () => {updateProject(new P.Project(p))}
    
    const SingleProjectDetailsComp = <SingleProjectDetails project={project} key={project.id}/>

    console.log(project)
    React.useEffect(() => {
        updateProject(new P.Project(p))
      }, [routeParams.id])
    

    //#region EVENTS
    const onEditProjectFormSaveButtonClick = (e: React.FormEvent) => {
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
                todoList: []
            }
            try {
                props.projectsManager.updateProject(projectData, project.id)
                editProjectModal.closeModal() //if i want to close or not the form after clicking on accept button
                editProjectForm.reset() //reset the fields of the form
                props.projectsManager.setUI_error(new Error(''),"none",'edit') //display the UI of error
            } catch (err) {
                props.projectsManager.setUI_error(err,"",'edit')
            }
        } else {console.warn("Edit project form was not found")}
      }

    const onEditProjectForm = <EditProjectform project={project} onEditProjectFormSaveButtonClick={onEditProjectFormSaveButtonClick} key={project.id}/>
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
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        id="button-todo-form-accept"
                        className="generic-buttons"
                    >
                        Accept
                    </button>
                    </div>
                </form>
                <div id="new-project-error-tab" style={{ display: "none" }} />
                </div>
            </dialog>
            <dialog id="edit-todo-modal">
                <div id="edit-todo-dialog">
                <form id="edit-todo-form">
                    <h2>Edit To-Do: change status or/and priority</h2>
                    <div className="input-list">
                    <div className="field-container">
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
                    <div className="field-container">
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
                        type="submit"
                        id="edit-todo-form-accept"
                        className="generic-buttons"
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
                        <textarea
                        maxLength={20}
                        className="search-bar"
                        cols={25}
                        rows={1}
                        placeholder="Search by name (max 20 ch)"
                        defaultValue={""}
                        />
                        <span
                        id="todo-add"
                        className="material-icons-outlined generic-buttons"
                        >
                        add
                        </span>
                    </div>
                    </div>
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
                    <div className="to-do-card">
                        <div
                        style={{
                            display: "flex",
                            gap: 15,
                            flexDirection: "row",
                            alignItems: "center"
                        }}
                        >
                        <span
                            id="construction"
                            className="material-icons-outlined"
                            style={{
                            backgroundColor: "gray",
                            borderRadius: 5,
                            padding: 10
                            }}
                        >
                            construction
                        </span>
                        This is the first thing to do on this project.
                        <br />
                        Second line of first thing.This is the first thing to do on this
                        project.
                        </div>
                        <div>Fri, 20 ago</div>
                    </div>
                    <div className="to-do-card">
                        <div
                        style={{
                            display: "flex",
                            gap: 15,
                            flexDirection: "row",
                            alignItems: "center"
                        }}
                        >
                        <span
                            id="construction"
                            className="material-icons-outlined"
                            style={{
                            backgroundColor: "gray",
                            borderRadius: 5,
                            padding: 10
                            }}
                        >
                            construction
                        </span>
                        This is the second thing to do on this project
                        </div>
                        <div>Thu, 12 feb</div>
                    </div>
                    </div>
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
                <div
                    id="viewer-container"
                    className="single-project-page-spaces viewer-container"
                    style={{ backgroundColor: "transparent", width: "100%", margin: 0 }}
                />
                </div>
            </div>
        </div>
    )
}