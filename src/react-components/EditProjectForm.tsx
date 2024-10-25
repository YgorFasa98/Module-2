import * as React from 'react'
import { Project } from '../classes/Project'
import { ProgressBar } from './ProgressBar'

interface Props {
    project: Project
    onEditProjectFormSaveButtonClick
}

export function EditProjectform (props:Props) {
    
    return(
        <dialog id="edit-project-modal">
            <div id="edit-project-dialog">
            <form id="edit-project-form">
                <h2>Edit Project</h2>
                <div className="input-list">
                <div className="field-container">
                    <label className="field-title">
                    <span className="material-symbols-outlined">abc</span>
                    Acronym
                    </label>
                    <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 60px",
                        alignItems: "center"
                    }}
                    >
                    <input
                        name="acronym"
                        size={30}
                        style={{ resize: "none" }}
                        maxLength={4}
                        defaultValue={props.project.acronym}
                    />
                    <input
                        name="color"
                        id="color"
                        type="color"
                        defaultValue={props.project.color}
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
                    <input name="name" type="text"  defaultValue={props.project.name}/>
                </div>
                <div className="field-container">
                    <label className="field-title">
                    <span className="material-icons-outlined form-icons">
                        home_work
                    </span>
                    Project type
                    </label>
                    <input name="projectType" type="text"  defaultValue={props.project.projectType}/>
                </div>
                <div className="field-container">
                    <label className="field-title">
                    <span className="material-icons-outlined form-icons">home</span>
                    Address
                    </label>
                    <input name="address" type="address" defaultValue={props.project.address}/>
                </div>
                <div className="field-container">
                    <label className="field-title">
                    <span className="material-icons-outlined form-icons">
                        business
                    </span>
                    Company name
                    </label>
                    <input name="companyName" type="text" defaultValue={props.project.companyName}/>
                </div>
                <div className="field-container">
                    <label className="field-title">
                    <span className="material-icons-outlined form-icons">update</span>
                    Status
                    </label>
                    <select name="status" defaultValue={props.project.status}>
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
                    <input name="cost" type="number" defaultValue={props.project.cost} />
                </div>
                {ProgressBar(props.project.progress)}
                </div>
                <div className="buttons">
                    <button
                        onClick={(e) => {props.onEditProjectFormSaveButtonClick(e)}}
                        type="submit"
                        id="button-editproject-form-save"
                        className="generic-buttons"
                    >
                        Save
                    </button>
                </div>
            </form>
            <div id="edit-project-error-tab" style={{ display: "none" }} />
            </div>
        </dialog>
    )
}