import * as React from 'react'
import { toggleModal, exportToJSON } from '../classes/Generic'
import * as P from '../classes/Project'
import { ProjectsManager } from '../classes/ProjectsManager'
import { ProjectCard } from './ProjectCard'
import { ProgressBar } from './ProgressBar'
import { SearchBar } from './SearchBar'

import * as Firestore from 'firebase/firestore'
import { getCollection } from '../firebase'
import { ITodo, ToDo } from '../classes/Todo'

import * as BUI from '@thatopen/ui'

interface Props {
    projectsManager: ProjectsManager
}

const fbProjectsCollection = getCollection<P.IProject>('/projects')

export function ProjectsPage (props: Props) {

  //#region MOUNTING STAGE
  const getFirestoreProjectTodo = async (collection: Firestore.CollectionReference<ITodo>): Promise<ToDo[]> => {
    const fbProjectTodosDocuments = await Firestore.getDocs(collection)
    const todoList = new Array
    for (const doc of fbProjectTodosDocuments.docs){
        const data = doc.data()
        try {
            data.expiredate = (data.expiredate as unknown as Firestore.Timestamp).toDate()
            todoList.push(new ToDo(data, doc.id))
        } catch (error) {
            console.log('any todo found')
        }
    }
    return todoList
  }

  const getFirestoreProjects = async() => {
    const fbProjectsDocuments = await Firestore.getDocs(fbProjectsCollection)
    for (const doc of fbProjectsDocuments.docs){
      const data = doc.data()
      const fbTodosCollection = getCollection<ITodo>(`/projects/${doc.id}/todoList`)
      const todoList = await getFirestoreProjectTodo(fbTodosCollection)
      data.todoList = todoList
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

  const progressBar = <ProgressBar startValue={30}/>
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
        //bim components inputs
        const formData = {}
        const formBimInputs = newProjectForm.querySelectorAll('bim-text-input')
        const formBimColor = newProjectForm.querySelector('bim-color-input')
        const formBimDropdown = newProjectForm.querySelector('bim-dropdown')
        const formBimProgress = newProjectForm.querySelectorAll('bim-label')
        formBimInputs.forEach(input => {
          const name = input.getAttribute('name') // Get the "name" attribute
          if (name) { 
            formData[name] = input.value || input.getAttribute('value') 
          }})
        formBimProgress.forEach(input => {
          if (input.getAttribute('name') === 'progress') {
            formData['progress'] = input.value || input.getAttribute('value') // Add to formData object
          }})
        formData['color'] = formBimColor?.value['color'] || formBimColor?.getAttribute('value')
        formData['status'] = formBimDropdown?.value[0] || formBimDropdown?.getAttribute('value')

        const projectData: P.IProject = { //store data in this dictionary
            type: 'project',
            color: formData['color'] as string,
            name: formData['name'] as string,
            address: formData['address'] as string,
            companyName: formData['companyName'] as string,
            acronym: formData['acronym'] as string,
            status: formData['status'] as P.status,
            cost: formData['cost'] as unknown as number,
            progress: formData['progress'] as unknown as number,
            projectType: formData['projectType'] as string,
            todoList: []
        }
        try {
          const doc = await Firestore.addDoc(fbProjectsCollection, projectData)
          props.projectsManager.newProject(projectData, doc.id) //create the object project using userData dictionary, boolean: compact or expanded userUI
          newProjectModal.closeModal() //if i want to close or not the form after clicking on accept button
          newProjectForm.reset() //reset the fields of the form
          props.projectsManager.setUI_error(new Error(''),"none",'new') //display the UI of error
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

  const onDownloadProjectsButtonClick = () =>  {
    console.log('prova')
    exportToJSON(props.projectsManager.list,'projects_list')
  }
  const onUploadProjectsButtonClick = () => {props.projectsManager.importFromJSON()}

  const onProjectsSearch = (value: string) => {
    setProjects(props.projectsManager.searchProject(value))
  }
  //#endregion

  //BUI
  const downloadButton = BUI.Component.create<BUI.Button>(() => {
    return BUI.html`
      <bim-button
        @click=${onDownloadProjectsButtonClick}
        id="project-download"
        icon='mingcute:download-2-fill'
      >
      </bim-button>`;
  })  
  const uploadButton = BUI.Component.create<BUI.Button>(() => {
    return BUI.html`
      <bim-button
        @click=${onUploadProjectsButtonClick}
        id="project-upload"
        icon='mingcute:upload-2-fill'
      >
      </bim-button>`;
  })
  const newProjectButton = BUI.Component.create<BUI.Button>(() => {
    return BUI.html`
      <bim-button 
        @click=${onNewProjectButtonClick} 
        id="new-project-button" 
        icon="streamline:add-1-solid" 
        label="New Project"
      ></bim-button>`;
  })
  const acceptButtonForm = BUI.Component.create<BUI.Button>(() => {
    return BUI.html`
      <bim-button
        @click=${(e) => {onNewProjectFormAcceptButtonClick(e)}}
        type="submit"
        name="submit"
        id="button-project-form-accept"
        label='Accept'
      ></bim-button>`
  })
  const cancelButtonForm = BUI.Component.create<BUI.Button>(() => {
    return BUI.html`
      <bim-button
        @click=${(e) => {onFormCancelButtonClick(e)}}
        type="cancel"
        label='Cancel'
      ></bim-button>`
  })

  React.useEffect(() => {
    const projectPageAddBar = document.getElementById('project-page-addbar')
    projectPageAddBar?.insertBefore(uploadButton, projectPageAddBar.firstChild)
    projectPageAddBar?.insertBefore(downloadButton, projectPageAddBar.firstChild)
    projectPageAddBar?.insertBefore(newProjectButton, projectPageAddBar.firstChild)

    const formButtons = document.getElementById('form-buttons')
    formButtons?.appendChild(cancelButtonForm)
    formButtons?.appendChild(acceptButtonForm)
  }, [])

  return(
    <div id="project-main-page" className="page" style={{ display: '""' }}>
      <dialog id="new-project-modal">
        <div id="new-project-dialog">
          <form id="new-project-form"> {/* new event for submit infos of new project form */}
            <bim-label style={{
              padding: '20px',
              color: 'white',
              fontSize: '25px',
              borderBottom: '2px solid white',
              }}
              height='100px'>
              New Project
            </bim-label>
            <div className="input-list">
              <div className="field-container">
                <bim-label class='bim-label-form' icon='ic:twotone-abc'>Acronym</bim-label>
                <div style={{ display: "flex", columnGap:'10px', alignItems: "center"}}>
                  <bim-text-input name='acronym' type='text' value='' style={{marginTop: '10px'}}></bim-text-input>
                  <bim-color-input name='color' value='#FB00FF' style={{maxWidth:'100px', marginTop: '10px'}}></bim-color-input>
                </div>
                <bim-label style={{ fontSize: 15, fontStyle: "italic", padding: 5 }}>Insert an abbreviation of project's name (max 4 characters, i.e.: SFH)</bim-label>
              </div>
              <div className="field-container">
                <bim-label class='bim-label-form' icon='qlementine-icons:rename-16'>Project name</bim-label>
                <bim-text-input name='name' type='text' value='' style={{marginTop: '10px'}}></bim-text-input>
              </div>
              <div className="field-container">
                <bim-label class='bim-label-form' icon='ci:building-03'>Project type</bim-label>
                <bim-text-input name='projectType' type='text' value='' style={{marginTop: '10px'}}></bim-text-input>
              </div>
              <div className="field-container">
                <bim-label class='bim-label-form' icon='lsicon:location-outline'>Address</bim-label>
                <bim-text-input name='address' type='text' value='' style={{marginTop: '10px'}}></bim-text-input>
              </div>
              <div className="field-container">
                <bim-label class='bim-label-form' icon='bx:dollar'>Cost</bim-label>
                <bim-text-input name='cost' type='text' value='' style={{marginTop: '10px'}}></bim-text-input>
              </div>
              <div className="field-container">
                <bim-label class='bim-label-form' icon='mdi:company'>Company name</bim-label>
                <bim-text-input name='companyName' type='text' value='' style={{marginTop: '10px'}}></bim-text-input>
              </div>
              <div className="field-container">
                <bim-label class='bim-label-form' icon='material-symbols:update-rounded'>Status</bim-label>
                <bim-dropdown name="status" style={{marginTop:'10px'}}>
                  <bim-option style={{padding:'10px', marginRight:'10px', marginLeft:'10px'}} label="Active" checked></bim-option>
                  <bim-option style={{padding:'10px', marginRight:'10px', marginLeft:'10px'}} label="Not started"></bim-option>
                  <bim-option style={{padding:'10px', marginRight:'10px', marginLeft:'10px'}} label="Completed"></bim-option>
                  <bim-option style={{padding:'10px', marginRight:'10px', marginLeft:'10px'}} label="Stopped"></bim-option>
                  <bim-option style={{padding:'10px', marginRight:'10px', marginLeft:'10px'}} label="Dismissed"></bim-option>
                </bim-dropdown>
              </div>
              {progressBar}
            </div>
            <div id='form-buttons' className="buttons" style={{columnGap:'5px'}}>
            </div>
          </form>
          <div id="new-project-error-tab" style={{ display: "none" }} />
        </div>
      </dialog>
      <dialog className="error-import" id="error-import-project"></dialog>
      <header id="header">
        <bim-label
          class="bim-label-header"
          icon="ic:outline-apartment"
        >
          Projects ({projects.length})
        </bim-label>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 10
          }}>
          <div
            id="project-page-addbar"
            style={{display:'flex', flexDirection:'row', columnGap:'20px'}}>
          </div>
          <div style={{marginLeft:'auto', width:'400px'}}>
            <SearchBar onChange={onProjectsSearch} searchBy='project name'/>
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