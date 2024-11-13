import * as React from 'react'
import { UsersManager } from '../classes/UsersManager'
import { UserCard } from './UserCard'
import * as U from '../classes/User'
import { calculateMeanAge, exportToJSON, toggleModal } from '../classes/Generic'
import { SearchBar } from './SearchBar'

import * as Firestore from 'firebase/firestore'
import { deleteDocument, getCollection } from '../firebase'
import * as Router from 'react-router-dom'

interface Props {
    usersManager: UsersManager
}

const fbUsersCollection = getCollection<U.IUser>('/users')

export function UsersPage (props:Props) {

    //#region MOUNTING STAGE
    const getFirestoreUsers = async() => {
        //TYPE ASSERTION !!! --> it's developer job to be sure that data in db complies with the interface!
        const fbUsersDocuments = await Firestore.getDocs(fbUsersCollection)
        for (const doc of fbUsersDocuments.docs){
            const data = doc.data()
            data.birthday = (data.birthday as unknown as Firestore.Timestamp).toDate()
            try {
                props.usersManager.newUser(data,doc.id)            
            } catch (error) {
                props.usersManager.updateUser(data,doc.id)
            }
        }
    }

    React.useEffect(() => {
        getFirestoreUsers()
    }, [])
    //#endregion

    const [users, setUsers] = React.useState<U.User[]>(props.usersManager.list)

    props.usersManager.onUserCreated = () => {setUsers([...props.usersManager.list])}
    props.usersManager.onSingleUserCardChange = () => {setUsers([...props.usersManager.list])}


    const onChangeUIAll = () => {
        const compactAllButton = document.getElementById('compact_all')
        const expandAllButton = document.getElementById('expand_all')
        if (compactAllButton && expandAllButton) {
            if (compactAllButton.style.display == 'inline') {
                compactAllButton.style.display = 'none'
                expandAllButton.style.display = 'inline'
                setUsers([...props.usersManager.list.map((user) => {
                    user.cardVersion = 'compact'
                    return user})])
            } else if (expandAllButton.style.display == 'inline') {
                compactAllButton.style.display = 'inline'
                expandAllButton.style.display = 'none'
                setUsers([...props.usersManager.list.map((user) => {
                    user.cardVersion = 'expanded'
                    return user})])
            }
        }
    }

    const onNewUserButtonClick = () => { //little different fron lessons because I implemented the showModal in an external class
        const newUserModal = new toggleModal('new-user-modal') //new project modal
        if (newUserModal) {
          newUserModal.showModal()
        } else {
          console.warn("New user modal was not found")
        }
    }

    const onFormAcceptButtonClick = async (e: React.FormEvent) => {
        const newUserModal = new toggleModal('new-user-modal') //new user modal
        const newUserForm = document.getElementById("new-user-form") //form element
        //form events
        if (newUserForm && newUserForm instanceof HTMLFormElement) { //check the existance of user form
            e.preventDefault()
            const formData = new FormData(newUserForm)
            const userData: U.IUser = { //store data in this dictionary
                type: "user" as string,
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
                const doc = await Firestore.addDoc(fbUsersCollection, userData)
                props.usersManager.newUser(userData, doc.id) //create the object user using userData dictionary, boolean: compact or expanded userUI
                newUserModal.closeModal() //if i want to close or not the form after clicking on accept button
                newUserForm.reset() //reset the fields of the form
                props.usersManager.setUI_error(new Error(''),"none",'new') //display the UI of error
            } catch (err) {
                props.usersManager.setUI_error(err,"",'new')
            }
          }
      }
    
    const onFormCancelButtonClick = (e: React.FormEvent) => {
        const newUserModal = new toggleModal('new-user-modal') //new user modal
        const newUserForm = document.getElementById("new-user-form") //form element
        if (newUserForm && newUserForm instanceof HTMLFormElement) { //check the existance of user form
          e.preventDefault()
          newUserModal.closeModal() //close the form
          newUserForm.reset()
          props.usersManager.setUI_error(new Error(''),"none",'new')
      }
    }

    const onUsersSearch = (value:string) => {
        setUsers(props.usersManager.searchUser(value))
    } 

    const meanAge = calculateMeanAge(users.map((u)=>{return u.birthday}))

    const onDownloadUsersButtonClick = () =>  {exportToJSON(props.usersManager.list,'users_list')}
    const onUploadUsersButtonClick = () => {props.usersManager.importFromJSON()}

    const navigateTo = Router.useNavigate()        
    props.usersManager.onUserDeleted = async (id) => { //this event is activated within project manager delete method executing the steps here
        await deleteDocument('/users', id) //function to delete doc in firestore
        //navigateTo(0) //return to home WAITING deleting is completed
        setUsers([...props.usersManager.list])
    }
    const onDeleteUserButtonClick = (id:string) => { //event on click mouse
        props.usersManager.deleteUser(id) //the event activates the method in project manager which activate: 1. the method above and 2. delete project from project manager list
    }

    const UsersCards = users.map((user) => {
        return <UserCard user={user} cardVersion={user.cardVersion} deleteEvent={onDeleteUserButtonClick} usersManager={props.usersManager} key={user.id}/>
    })

    return(
        <div id="users-page" className="page">
            <dialog id="new-user-modal">
                <div id="new-user-dialog">
                <form id="new-user-form">
                    <h2>New User</h2>
                    <div className="input-list">
                    <div className="field-container">
                        <label className="field-title">
                        <span className="material-icons-outlined form-icons">badge</span>
                        Name
                        </label>
                        <input id="category-name" type="text" name="name" />
                        <div style={{ fontSize: 15, fontStyle: "italic", padding: 5 }}>
                        Insert name and surname
                        </div>
                    </div>
                    <div className="field-container">
                        <label className="field-title">
                        <span className="material-icons-outlined form-icons">
                            alternate_email
                        </span>
                        E-mail
                        </label>
                        <input name="email" type="text" />
                    </div>
                    <div className="field-container">
                        <label className="field-title">
                        <span className="material-icons-outlined form-icons">
                            engineering
                        </span>
                        Role
                        </label>
                        <select name="role">
                        <option>Engineer</option>
                        <option>Architect</option>
                        <option>BIM manager</option>
                        <option>BIM coordinator</option>
                        <option>BIM specialist</option>
                        </select>
                    </div>
                    <div className="field-container">
                        <label className="field-title">
                        <span className="material-icons-outlined form-icons">
                            more_horiz
                        </span>
                        Other informations
                        </label>
                    </div>
                    <div className="field-container" style={{ marginLeft: 25 }}>
                        <label className="field-title">
                        <span className="material-icons-outlined form-icons">menu</span>
                        Self description
                        </label>
                        <textarea
                        name="selfDescription"
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
                        <span className="material-icons-outlined form-icons">
                            transgender
                        </span>
                        Gender
                        </label>
                        <fieldset
                        style={{ display: "flex", flexDirection: "row", gap: 25 }}
                        >
                        <label>
                            <input name="gender" type="radio" defaultValue="Male" /> Male
                        </label>
                        <label>
                            <input name="gender" type="radio" defaultValue="Female" />{" "}
                            Female
                        </label>
                        <label>
                            <input name="gender" type="radio" defaultValue="Other" /> Other
                        </label>
                        </fieldset>
                    </div>
                    <div className="field-container" style={{ marginLeft: 25 }}>
                        <label className="field-title">
                        <span className="material-icons-outlined form-icons">event</span>
                        Birthday date
                        </label>
                        <input name="birthday" type="date" className="date" />
                    </div>
                    <div className="field-container" style={{ marginLeft: 25 }}>
                        <label className="field-title">
                        <span className="material-icons-outlined form-icons">home</span>
                        Address
                        </label>
                        <input name="address" type="address" />
                    </div>
                    <div className="field-container" style={{ marginLeft: 25 }}>
                        <label className="field-title">
                        <span className="material-icons-outlined form-icons">
                            business
                        </span>
                        Company name
                        </label>
                        <input name="companyName" type="text" />
                    </div>
                    </div>
                    <div className="buttons">
                    <button
                        onClick={(e) => {onFormCancelButtonClick(e)}}
                        type="button"
                        id="button-user-form-cancel"
                        className="generic-buttons"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={(e) => {onFormAcceptButtonClick(e)}}
                        type="submit"
                        id="button-user-form-accept"
                        className="generic-buttons"
                    >
                        Accept
                    </button>
                    </div>
                </form>
                <div id="new-user-error-tab" style={{ display: "none" }} />
                </div>
            </dialog>
            <dialog className="error-import" id="error-import-user"></dialog>
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
                    person
                </span>
                <h1 id="manageUsersTitle" style={{ fontFamily: "Roboto", color: "gray" }}>
                    Manage Users ({users.length})
                </h1>
                </div>
                <div id="users-page-addbar">
                <button id="new-user-button" onClick={onNewUserButtonClick}>
                    <span
                    id="add"
                    className="material-icons-outlined generic-buttons"
                    style={{ backgroundColor: "transparent", padding: 0 }}
                    >
                    person_add_alt
                    </span>
                    <h3>New User</h3>
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
                    onClick={onUploadUsersButtonClick}
                    id="user-upload"
                    className="material-icons-outlined generic-buttons"
                    >
                    upload
                    </span>
                    <span
                    onClick={onDownloadUsersButtonClick}
                    id="user-download"
                    className="material-icons-outlined generic-buttons"
                    >
                    download
                    </span>
                    <div style={{ width: 10 }} />
                    <SearchBar onChange={onUsersSearch} searchBy='user name'/>
                    <span id="search" className="material-icons-outlined generic-buttons">
                    search
                    </span>
                </div>
                </div>
                <div id="meanAge" style={{ padding: 20 }}>
                <div>
                    Users mean age: {meanAge}
                    <h3 style={{ fontWeight: "normal" }} />
                </div>
                </div>
            </header>
            <div id="users-page-content">
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "50px 300px 400px 1fr 50px",
                        marginLeft: 30,
                        gap: 20,
                        padding: 5,
                        marginRight: 25
                    }}
                >
                <h3 style={{ color: "gray" }} />
                <h3 style={{ color: "gray" }}>Name</h3>
                <h3 style={{ color: "gray" }}>E-mail</h3>
                <h3 style={{ color: "gray" }}>Role</h3>
                <span
                    onClick={onChangeUIAll}
                    id="compact_all"
                    className="material-icons-outlined generic-buttons"
                    style={{ display: "none", textAlign: "center" }}
                >
                    expand_less
                </span>
                <span
                    onClick={onChangeUIAll}
                    id="expand_all"
                    className="material-icons-outlined generic-buttons"
                    style={{ display: "inline", textAlign: "center" }}
                >
                    expand_more
                </span>
                </div>
                {
                users.length > 0 ? <ul className="card-list" id="users-list">{UsersCards}</ul> : <p style={{display:'flex', flexDirection:'column', fontSize:'20px', alignItems:'center'}}>Any user found!</p>
                }
            </div>
        </div>
    )
}