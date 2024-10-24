import * as React from 'react'
import * as Router from 'react-router-dom'
import * as P from '../classes/Project'
import { toggleModal } from '../classes/Generic'

interface Props {
    project: P.Project
}

export function SingleProjectDetails (props:Props) {
    const onEditProjectButtonClick = () => { //little different fron lessons because I implemented the showModal in an external class
        const editProjectModal = new toggleModal('edit-project-modal')
        if (editProjectModal) {
            editProjectModal.showModal()
        } else {
        console.warn("Edit project modal was not found")
        }
    }
    return(
        <div
            className="single-project-page-spaces dash-card"
            style={{ margin: 0 }}
        >
            <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}
            >
            <p
                data-project-details-info="acronym"
                style={{
                backgroundColor: `${props.project.color}`,
                borderRadius: 10,
                padding: 15,
                fontSize: 24
                }}
            >
                {props.project.acronym}
            </p>
            <button id="edit-button" onClick={onEditProjectButtonClick}>Edit</button>
            </div>
            <div style={{ borderBottom: "1px solid white", paddingBottom: 5 }}>
            <h3 data-project-details-info="name">{props.project.name}</h3>
            <p data-project-details-info="address">{props.project.address}</p>
            </div>
            <div id="details">
            <div style={{ marginLeft: 5, marginRight: 5 }}>
                <p style={{ color: "dimgray" }}>Company</p>
                <p data-project-details-info="company">{props.project.companyName}</p>
            </div>
            <div style={{ marginLeft: 5, marginRight: 5 }}>
                <p style={{ color: "dimgray" }}>Project type</p>
                <p data-project-details-info="project-type">{props.project.projectType}</p>
            </div>
            <div style={{ marginLeft: 5, marginRight: 5 }}>
                <p style={{ color: "dimgray" }}>Status</p>
                <p data-project-details-info="status">{props.project.status}</p>
            </div>
            <div style={{ marginLeft: 5, marginRight: 5 }}>
                <p style={{ color: "dimgray" }}>Cost</p>
                <p data-project-details-info="cost">€ {props.project.cost}</p>
            </div>
            </div>
            <div>
            <p style={{ color: "dimgray", marginBottom: 5 }}>Progress bar</p>
            <div className="loading-bar-container">
                <div data-project-details-info="progress" className="loading-bar" style={{width: `${props.project.progress}%`}}>
                {props.project.progress} %
                </div>
            </div>
            </div>
        </div>
    )
}
