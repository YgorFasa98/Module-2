import * as React from 'react'
import { toggleModal, exportToJSON } from '../classes/Generic'
import * as P from '../classes/Project'
import { ProjectsManager } from '../classes/ProjectsManager'
import { ProjectCard } from './ProjectCard'

export function ProjectsPage () {

  //#region STATES
  const [projectsManager] = React.useState(new ProjectsManager())
  const [progress, setProgress] = React.useState(20) //progress-bar of new project form states update
  const [projects, setProjects] = React.useState<P.Project[]>(projectsManager.list)

  projectsManager.onProjectCreated = () => {setProjects([...projectsManager.list])}
  projectsManager.onProjectCreated = () => {setProjects([...projectsManager.list])}

  React.useEffect(() => {
    console.log('Projects updated', projects)
  }, [projects])

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

  const onFormAcceptButtonClick = (e: React.FormEvent) => {
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
            const project = projectsManager.newProject(projectData) //create the object project using userData dictionary, boolean: compact or expanded userUI
            newProjectModal.closeModal() //if i want to close or not the form after clicking on accept button
            newProjectForm.reset() //reset the fields of the form
            projectsManager.setUI_error(new Error(''),"none",'new') //display the UI of error
            //console.log(project)
        } catch (err) {
            projectsManager.setUI_error(err,"",'new')
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
      projectsManager.setUI_error(new Error(''),"none",'new')
  }
}

  const onDownloadProjectsButtonClick = () =>  {
    const downloadButtonProject = document.getElementById("project-download") //download button
    if (downloadButtonProject) {
      downloadButtonProject.addEventListener('click', () => { //download users list as json file
          exportToJSON(projectsManager.list,'projects_list') //moved the export to json from userManager to generic
      })
  } else {console.warn("Download project button was not found")}
  }

  const onUploadProjectsButtonClick = () => {
    const uploadButtonProject = document.getElementById("project-upload") //upload button
    if (uploadButtonProject) {
      uploadButtonProject.addEventListener('click', () => { //upload json file of users
          projectsManager.importFromJSON()
      })
  } else {console.warn("Upload project button was not found")}
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
              <div className="field-container">
                <label className="field-title">
                  <span className="material-icons-outlined form-icons">euro</span>
                  Total cost
                </label>
                <input name="cost" type="number" defaultValue={0} />
              </div>
              <div className="field-container">
                <label className="field-title">
                  <span className="material-icons-outlined form-icons">
                    rotate_right
                  </span>
                  Progress
                </label>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}
                >
                  <input
                    className="progress-bar"
                    name="progress"
                    type="range"
                    min={0}
                    max={100}
                    value={progress} //react value for update the progress value
                    onChange={(e) => setProgress(Number(e.target.value))} //function that update the progress value in live
                    style={{ width: "85%", height: 18 }}
                  />
                  <p style={{ marginRight: 10 }}>
                    <output className="progress-value" htmlFor="progress-bar">
                      {progress} {/*the progress value updated*/}
                    </output>{" "}
                    %
                  </p>
                </div>
              </div>
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
                onClick={(e) => {onFormAcceptButtonClick(e)}}
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
            Projects (default value)
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
            <textarea
              style={{ margin: 0 }}
              maxLength={20}
              className="search-bar"
              cols={40}
              rows={1}
              placeholder="Search by name (max 20 ch)"
              defaultValue={""}
            />
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
        <div className="project-list" id="project-list">
          <ProjectCard />
        </div>
      </div>
    </div>      
  )
}