import * as React from 'react'
import { toggleModal, exportToJSON } from '../classes/Generic'
import * as P from '../classes/Project'
import { ProjectsManager } from '../classes/ProjectsManager'
import { ProjectCard } from './ProjectCard'
import { ProgressBar } from './ProgressBar'
import { SearchBar } from './SearchBar'

import * as Firestore from 'firebase/firestore'
import { getCollection } from '../firebase'

interface Props {
    projectsManager: ProjectsManager
}

const fbProjectsCollection = getCollection<P.IProject>('/projects')

export function ProjectsPage (props: Props) {

  //#region MOUNTING STAGE
  const getFirestoreProjects = async() => {
    //TYPE ASSERTION !!! --> it's developer job to be sure that data in db complies with the interface!
    const fbProjectsDocuments = await Firestore.getDocs(fbProjectsCollection)
    for (const doc of fbProjectsDocuments.docs){
      const data = doc.data()
      data.todoList = []
      try {
        props.projectsManager.newProject(data, doc.id)
      } catch (error) {
        props.projectsManager.updateProject(data, doc.id)
      }
    }
  }
  
  React.useEffect(() => {
    getFirestoreProjects()
  }, [])
  //#endregion

  //#region STATES
  const [projects, setProjects] = React.useState<P.Project[]>(props.projectsManager.list)

  props.projectsManager.onProjectCreated = () => {setProjects([...props.projectsManager.list])}
  props.projectsManager.onProjectsCardsUpdate = () => {setProjects([...props.projectsManager.list])}

  const ProjectsCards = projects.map((projects) => {
    return <ProjectCard project={projects} key={projects.id}/>
  })

  //#endregion
  
  //#region EVENTS
  const onNewProjectButtonClick = () => { //little different fron lessons because I implemented the showModal in an external class
    const newProjectModal = new toggleModal('new-project-modal') //new project modal
    if (newProjectModal) {
      newProjectModal.showModal()
    } else {
      console.warn("New project modal was not found")
    }
  }

  const onNewProjectFormAcceptButtonClick = async (e: React.FormEvent) => {
    const newProjectModal = new toggleModal('new-project-modal') //new project modal
    const newProjectForm = document.getElementById("new-project-form") //form element
    //form events
    if (newProjectForm && newProjectForm instanceof HTMLFormElement) { //check the existance of user form
        e.preventDefault()
        const formData = new FormData(newProjectForm)
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
          const doc = await Firestore.addDoc(fbProjectsCollection, projectData)
          props.projectsManager.newProject(projectData, doc.id) //create the object project using userData dictionary, boolean: compact or expanded userUI
          newProjectModal.closeModal() //if i want to close or not the form after clicking on accept button
          newProjectForm.reset() //reset the fields of the form
          props.projectsManager.setUI_error(new Error(''),"none",'new') //display the UI of error
          //console.log(project)
        } catch (err) {
            props.projectsManager.setUI_error(err,"",'new')
        }
      }
  }

  const onFormCancelButtonClick = (e: React.FormEvent) => {
    const newProjectModal = new toggleModal('new-project-modal') //new project modal
    const newProjectForm = document.getElementById("new-project-form") //form element
    if (newProjectForm && newProjectForm instanceof HTMLFormElement) { //check the existance of user form
      e.preventDefault()
      newProjectModal.closeModal() //close the form
      newProjectForm.reset()
      props.projectsManager.setUI_error(new Error(''),"none",'new')
  }
}

  const onDownloadProjectsButtonClick = () =>  {exportToJSON(props.projectsManager.list,'projects_list')}
  const onUploadProjectsButtonClick = () => {props.projectsManager.importFromJSON()}

  const onProjectsSearch = (value: string) => {
    setProjects(props.projectsManager.searchProject(value))
  }
  //#endregion

  //#region STYLES
  //example of tipStyle CSS for React syntax
  const tipStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 60px",
    alignItems: "center"
  }
  //#endregion

  return(
    <div id="project-main-page" className="page" style={{ display: '""' }}>
      <dialog id="new-project-modal">
        <div id="new-project-dialog">
          <form id="new-project-form"> {/* new event for submit infos of new project form */}
            <h2>New Project</h2>
            <div className="input-list">
              <div className="field-container">
                <label className="field-title">
                  <span className="material-symbols-outlined">abc</span>
                  Acronym
                </label>
                <div
                  style={tipStyle}
                >
                  <input
                    name="acronym"
                    size={30}
                    style={{ resize: "none" }}
                    maxLength={4}
                  />
                  <input
                    id="color"
                    name="color"
                    type="color"
                    defaultValue="#931f1f"
                    style={{
                      backgroundColor: "transparent",
                      padding: 0,
                      marginLeft: 10,
                      height: 50
                    }}
                  />
                </div>
                <div style={{ fontSize: 15, fontStyle: "italic", padding: 5 }}>
                  Insert an abbreviation of project's name (max 4 characters, i.e.:
                  SFH)
                </div>
              </div>
              <div className="field-container">
                <label className="field-title">
                  <span className="material-symbols-outlined form-icons">
                    location_away
                  </span>
                  Project name
                </label>
                <input name="name" type="text" />
              </div>
              <div className="field-container">
                <label className="field-title">
                  <span className="material-icons-outlined form-icons">
                    home_work
                  </span>
                  Project type
                </label>
                <input name="projectType" type="text" />
              </div>
              <div className="field-container">
                <label className="field-title">
                  <span className="material-icons-outlined form-icons">home</span>
                  Address
                </label>
                <input name="address" type="address" />
              </div>
              <div className="field-container">
                <label className="field-title">
                  <span className="material-icons-outlined form-icons">
                    business
                  </span>
                  Company name
                </label>
                <input name="companyName" type="text" />
              </div>
              <div className="field-container">
                <label className="field-title">
                  <span className="material-icons-outlined form-icons">update</span>
                  Status
                </label>
                <select name="status">
                  <option>Active</option>
                  <option>Not started</option>
                  <option>Completed</option>
                  <option>Stopped</option>
                  <option>Dismissed</option>
                </select>
              </div>
              {ProgressBar(20)}
            </div>
            <div className="buttons">
              <button
                onClick={(e) => {onFormCancelButtonClick(e)}}
                type="button"
                id="button-project-form-cancel"
                className="generic-buttons"
              >
                Cancel
              </button>
              <button
                onClick={(e) => {onNewProjectFormAcceptButtonClick(e)}}
                type="submit"
                id="button-project-form-accept"
                className="generic-buttons"
              >
                Accept
              </button>
            </div>
          </form>
          <div id="new-project-error-tab" style={{ display: "none" }} />
        </div>
      </dialog>
      <dialog className="error-import" id="error-import-project"></dialog>
      <header id="header">
        <div
          style={{
            gap: 10,
            marginBottom: 0,
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <span
            className="material-icons-outlined"
            style={{ color: "gray", fontSize: 40 }}
          >
            house
          </span>
          <h1 id="ProjectsTitle" style={{ fontFamily: "Roboto", color: "gray" }}>
            Projects ({projects.length})
          </h1>
        </div>
        <div
          id="project-page-addbar"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10
          }}
        >
          <button onClick={onNewProjectButtonClick} id="new-project-button"> {/*new event for showing new project modal*/}
            <span
              id="add"
              className="material-icons-outlined generic-buttons"
              style={{ backgroundColor: "transparent", padding: 0 }}
            >
              add
            </span>
            <h3>New Project</h3>
          </button>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 5
            }}
          >
            <span
              onClick={onUploadProjectsButtonClick}
              id="project-upload"
              className="material-icons-outlined generic-buttons"
            >
              upload
            </span>
            <span
              onClick={onDownloadProjectsButtonClick}
              id="project-download"
              className="material-icons-outlined generic-buttons"
            >
              download
            </span>
            <div style={{ width: 10 }} />
            <SearchBar onChange={onProjectsSearch} searchBy='project name'/>
            <span id="search" className="material-icons-outlined generic-buttons">
              search
            </span>
          </div>
        </div>
      </header>
      <div
        className="card-list"
        style={{ flexGrow: 1, overflow: "auto", marginTop: 30, padding: 5 }}
      >
        {
          projects.length > 0 ? <div className="project-list" id="project-list">{ProjectsCards}</div> : <p style={{display:'flex', flexDirection:'column', fontSize:'20px', alignItems:'center'}}>Any project found!</p>
        }
      </div>
    </div>      
  )
}