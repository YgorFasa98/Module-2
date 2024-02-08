import * as P from './classes/User'
import { UsersManager } from './classes/UsersManager'

//USERS PAGE EVENTS
//buttons
const newUserButton = document.getElementById("new-user-button") //new user button
const donwloadButton = document.getElementById("download") //download button
const uploadButton = document.getElementById("user-upload") //upload button
const expandAllButton = document.getElementById('expand_all') //expand all button
const compactAllButton = document.getElementById('compact_all') //comapct all button
//modal
const newUserModal = new P.toggleModal('new-user-modal') //new user modal
//event click on users page buttons
if (donwloadButton) {
    donwloadButton.addEventListener('click', () => { //download users list as json file
        usersManager.exportToJSON()
    })
} else {console.warn("Download button was not found")}

if (uploadButton) {
    uploadButton.addEventListener('click', () => { //upload json file of users
        usersManager.importFromJSON()
    })
} else {console.warn("Upload button was not found")}

if (newUserButton && newUserModal) {
    newUserButton.addEventListener('click', () => {  //show modal of new user
        newUserModal.showModal()
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


//FORM INPUT EVENTS
//form elements
const userFormAccept = document.getElementById("button-form-accept") //accept button
const userFormCancel = document.getElementById("button-form-cancel") //cancel button
const newUserForm = document.getElementById("new-user-form") //form element
//users page container and cards
const usersListUI = document.getElementById("users-list") as HTMLUListElement //container of users cards
const usersManager = new UsersManager(usersListUI) //new instance of users manager class
//form events
if (newUserForm && newUserForm instanceof HTMLFormElement) { //check the existance of user form
    if (userFormAccept && userFormCancel) { //check the esistance of accept and cancel button

        userFormAccept.addEventListener('click', (e) => { //event click on accept button
            const formData = new FormData(newUserForm)
            e.preventDefault()
            const userData: P.IUser = { //store data in this dictionary
                name: formData.get('name') as string,
                email: formData.get('email') as string,
                role: formData.get('role') as P.role,
                selfDescription: formData.get('selfDescription') as string,
                gender: formData.get('gender') as P.gender,
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


//SIDEBAR EVENTS
//sidebar buttons
const menuProjectsButton = document.getElementById("project-button") //project button sidebar
const menuUsersButton = document.getElementById("users-button") //users button sidebar
const menuInfoButton = document.getElementById("project-details-button") //info button sidebar
//pages to open
const pageProjects = document.getElementById('project-main-page') as HTMLElement //projects page
const pageUsers = document.getElementById('users-page') as HTMLElement //users page
const pageSingleProject = document.getElementById('single-project-page') as HTMLElement //single project page

if (menuProjectsButton && menuUsersButton && menuInfoButton && expandAllButton) {
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
    menuInfoButton.addEventListener('click', () => { //events of info button
        pageProjects.style.display = "none"
        pageUsers.style.display = "none"
        pageSingleProject.style.display = ""
    })
} else {console.warn("Menu button was not found")}

