import * as U from './classes/User'
import * as P from './classes/Project'
import { toggleModal, exportToJSON } from './classes/Generic'
import { UsersManager } from './classes/UsersManager'
import { ProjectsManager } from './classes/ProjectsManager'

//PROJECTS PAGE EVENTS

const projectsListUI = document.getElementById("project-list") as HTMLDivElement //container of users cards
const projectsManager = new ProjectsManager(projectsListUI) //new instance of users manager class

//USERS PAGE EVENTS
//buttons
const newUserButton = document.getElementById("new-user-button") //new user button
const newProjectButton = document.getElementById("new-project-button") //new user button
const downloadButtonUser = document.getElementById("user-download") //download button
const uploadButtonUser = document.getElementById("user-upload") //upload button
const downloadButtonProject = document.getElementById("project-download") //download button
const uploadButtonProject = document.getElementById("project-upload") //upload button
const expandAllButton = document.getElementById('expand_all') //expand all button
const compactAllButton = document.getElementById('compact_all') //comapct all button

//users page container and cards
const usersListUI = document.getElementById("users-list") as HTMLUListElement //container of users cards
const usersManager = new UsersManager(usersListUI) //new instance of users manager class
//modal
const newUserModal = new toggleModal('new-user-modal') //new user modal
const newProjectModal = new toggleModal('new-project-modal') //new user modal

//event click on users page buttons
if (downloadButtonUser && downloadButtonProject) {
    downloadButtonUser.addEventListener('click', () => { //download users list as json file
        exportToJSON(usersManager.list,'users_list') //moved the export to json from userManager to generic
    })
    downloadButtonProject.addEventListener('click', () => { //download users list as json file
        exportToJSON(projectsManager.list,'projects_list') //moved the export to json from userManager to generic
    })
} else {console.warn("Download button was not found")}

if (uploadButtonUser && uploadButtonProject) {
    uploadButtonUser.addEventListener('click', () => { //upload json file of users
        usersManager.importFromJSON()
    })
    uploadButtonProject.addEventListener('click', () => { //upload json file of users
        projectsManager.importFromJSON()
    })
} else {console.warn("Upload button was not found")}

if (newUserButton && newUserModal) {
    newUserButton.addEventListener('click', () => {  //show modal of new user
        newUserModal.showModal()
    })
} else {console.warn("New user button was not found")}

if (newProjectButton && newProjectModal) {
    newProjectButton.addEventListener('click', () => {  //show modal of new user
        newProjectModal.showModal()
    })
} else {console.warn("New user button was not found")}

if (expandAllButton && compactAllButton) {
    expandAllButton.addEventListener('click', () => { //events of expand button
        usersManager.setUI_expandAll()
        expandAllButton.style.display = 'none'
        compactAllButton.style.display = ''
    })
    compactAllButton.addEventListener('click', () => { //events of compact button
        usersManager.setUI_compactAll()
        expandAllButton.style.display = ''
        compactAllButton.style.display = 'none'
    })
} else {console.warn("Expand/Compact all button was not found")}

//USER FORM INPUT EVENTS
//form elements
const userFormAccept = document.getElementById("button-user-form-accept") //accept button
const userFormCancel = document.getElementById("button-user-form-cancel") //cancel button
const newUserForm = document.getElementById("new-user-form") //form element
//form events
if (newUserForm && newUserForm instanceof HTMLFormElement) { //check the existance of user form
    if (userFormAccept && userFormCancel) { //check the esistance of accept and cancel button

        userFormAccept.addEventListener('click', (e) => { //event click on accept button
            const formData = new FormData(newUserForm)
            e.preventDefault()
            const userData: U.IUser = { //store data in this dictionary
                name: formData.get('name') as string,
                email: formData.get('email') as string,
                role: formData.get('role') as U.role,
                selfDescription: formData.get('selfDescription') as string,
                gender: formData.get('gender') as U.gender,
                birthday: new Date(formData.get('birthday') as string),
                address: formData.get('address') as string,
                companyName: formData.get('companyName') as string,
                userImage: 'assets/genericUser.jpg'
            }
            try {
                const user = usersManager.newUser(userData) //create the object project using userData dictionary, boolean: compact or expanded userUI
                newUserModal.closeModal() //if i want to close or not the form after clicking on accept button
                newUserForm.reset() //resent the fields of the form
                usersManager.setUI_error(new Error(''),"none") //display the UI of error
            } catch (err) {
                usersManager.setUI_error(err,"")
            }
        }) //end of event

        userFormCancel.addEventListener('click', (e) => { //event click on cancel button
            e.preventDefault()
            newUserModal.closeModal() //close the form
            newUserForm.reset()
            usersManager.setUI_error(new Error(''),"none")
        })

    } else {console.warn("Bottons of form not founded")}
} else {console.warn("New user form was not found")}


//PROJECT FORM INPUT EVENTS
//form elements
const projectFormAccept = document.getElementById("button-project-form-accept") //accept button
const projectFormCancel = document.getElementById("button-project-form-cancel") //cancel button
const newProjectForm = document.getElementById("new-project-form") //form element
//form events
if (newProjectForm && newProjectForm instanceof HTMLFormElement) { //check the existance of user form
    if (projectFormAccept && projectFormCancel) { //check the esistance of accept and cancel button

        projectFormAccept.addEventListener('click', (e) => { //event click on accept button
            const formData = new FormData(newProjectForm)
            e.preventDefault()
            const projectData: P.IProject = { //store data in this dictionary
                name: formData.get('name') as string,
                address: formData.get('address') as string,
                companyName: formData.get('companyName') as string,
                acronym: formData.get('acronym') as string,
                status: formData.get('status') as P.status,
                cost: formData.get('cost') as unknown as number,
                progress: formData.get('progress') as unknown as number,
                projectType: formData.get('projectType') as string,
            }
            try {
                const project = projectsManager.newProject(projectData) //create the object project using userData dictionary, boolean: compact or expanded userUI
                newProjectModal.closeModal() //if i want to close or not the form after clicking on accept button
                newProjectForm.reset() //resent the fields of the form
                projectsManager.setUI_error(new Error(''),"none") //display the UI of error
            } catch (err) {
                projectsManager.setUI_error(err,"")
            }
        }) //end of event

        projectFormCancel.addEventListener('click', (e) => { //event click on cancel button
            e.preventDefault()
            newProjectModal.closeModal() //close the form
            newProjectForm.reset()
            projectsManager.setUI_error(new Error(''),"none")
        })

    } else {console.warn("Bottons of form not founded")}
} else {console.warn("New project form was not found")}

//SIDEBAR EVENTS
//sidebar buttons
const menuProjectsButton = document.getElementById("project-button") //project button sidebar
const menuUsersButton = document.getElementById("users-button") //users button sidebar
const menuSingleProjectButton = document.getElementById("project-details-button") //info button sidebar
//pages to open
const pageProjects = document.getElementById('project-main-page') as HTMLElement //projects page
const pageUsers = document.getElementById('users-page') as HTMLElement //users page
const pageSingleProject = document.getElementById('single-project-page') as HTMLElement //single project page

if (menuProjectsButton && menuUsersButton && menuSingleProjectButton && expandAllButton) {
    menuProjectsButton.addEventListener('click', () => {  //events of project button
        pageProjects.style.display = ""
        pageUsers.style.display = "none"
        pageSingleProject.style.display = "none"
    })
    menuUsersButton.addEventListener('click', () => { //events of users button
        pageProjects.style.display = "none"
        pageUsers.style.display = ""
        pageSingleProject.style.display = "none"
    })
    menuSingleProjectButton.addEventListener('click', () => { //events of info button
        pageProjects.style.display = "none"
        pageUsers.style.display = "none"
        pageSingleProject.style.display = ""
    })
} else {console.warn("Menu button was not found")}

//Progress bar slider value update
const slider = document.getElementById('progress-bar');
const output = document.querySelector('output[for="progress-bar"]');
slider.addEventListener('input', function() {
  output.textContent = slider.value;
});