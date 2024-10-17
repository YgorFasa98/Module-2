import * as React from 'react'

export function Sidebar() {
    return(
        <aside id="sidebar">
        <div style={{display: 'flex', 'flexDirection': 'column', alignItems: 'center'}}>
            <img id="company-logo" src="assets/logo.svg" alt="Missed image reference" style={{width: '100px', height: '100px', paddingTop: '20px'}} />
        </div>
            B  I  M 
        <ul className="nav-buttons" id="nav-buttons-home">
            <li id="project-button">
                <span className="material-icons-outlined">maps_home_work</span>
                <div>Projects Home</div>
            </li>
            <li id="users-button">
                <span className="material-icons-outlined">person</span>
                <div>Users</div>
            </li>
            <li id="info-button">
                <span className="material-icons-outlined">info</span>
                <div>Info</div>
            </li>
        </ul>
        <ul className="nav-buttons" id="nav-buttons-projects" style={{display: 'none', borderTop: '2px solid gray', paddingTop: '15px'}}>
            <li id="list-projects-button" style={{marginLeft: '5px', justifyContent: 'space-between'}} value='"expanded"'>
                <span className="material-icons-outlined">menu</span>
                <div>List of projects</div>
                <span id="compact_all_projects" className="material-icons-outlined" style={{textAlign: 'center'}}>expand_less</span>
                <span id="expand_all_projects" className="material-icons-outlined" style={{display: 'none', textAlign: 'center'}}>expand_more</span>
            </li>
        </ul>
    </aside>
    )
}