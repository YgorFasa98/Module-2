import * as React from 'react'
import * as Router from 'react-router-dom'
import { ProjectButton } from './ProjectButton'
import { ProjectsManager } from '../classes/ProjectsManager'
import * as P from '../classes/Project'

interface Props {
    projectsManager: ProjectsManager
}

export function Sidebar(props:Props) {
    //#region STATES
    const [projects, setProjects] = React.useState<P.Project[]>(props.projectsManager.list)

    props.projectsManager.onSidebarButtons = () => {setProjects([...props.projectsManager.list])}

    const ProjectsButtons = projects.map((projects) => {
        return <ProjectButton project={projects} key={projects.id}/>
    })

    //hide or show projects buttons in home page or other pages
    const routePath = Router.useLocation().pathname
    const listOfProjects = document.getElementById("nav-buttons-projects")
    if (listOfProjects){
        if(['/home','/users','/info'].includes(routePath)){
            listOfProjects.style.display = 'none'
        } else {
            listOfProjects.style.display = ''
        }
    }

    const onShowProjectsButtons = (e) => { 
        const listProjectsButton = document.getElementById('list-projects-button') as HTMLElement
        //const listProjectsButton = e.currentTarget
        const compact_all_projects = document.getElementById('compact_all_projects') as HTMLElement
        const expand_all_projects = document.getElementById('expand_all_projects') as HTMLElement
        const singleProjectButtons = document.getElementsByClassName('single-project-button')
        if (listProjectsButton.getAttribute('value') == 'expanded'){
            compact_all_projects.style.display = 'none'
            expand_all_projects.style.display = ''
            for (const button of singleProjectButtons){
                const b = button as HTMLElement
                b.style.display = 'none'
                listProjectsButton.setAttribute('value','compact')
            }
        }else if (listProjectsButton.getAttribute('value') == 'compact'){
            compact_all_projects.style.display = ''
            expand_all_projects.style.display = 'none'
            for (const button of singleProjectButtons){
                const b = button as HTMLElement
                b.style.display = ''
                listProjectsButton.setAttribute('value','expanded')
            }
        }
    }

    const buttonStyle = {
        fontSize: '20px'
    }

    return(
        <aside id="sidebar">
            <div style={{display: 'flex', 'flexDirection': 'column', alignItems: 'center'}}>
                <img id="company-logo" src="assets/logo.svg" alt="Missed image reference" style={{width: '100px', height: '100px', paddingTop: '20px'}} />
            </div>
                B  I  M 
            <ul className="nav-buttons" id="nav-buttons-home">
                <Router.Link to='/home'>
                    <li id="home-button">
                        <bim-label style={buttonStyle} icon="ic:outline-apartment">Projects Home</bim-label>
                    </li>
                </Router.Link>                
                <Router.Link to='/users'>
                    <li id="users-button">
                        <bim-label style={buttonStyle} icon="ic:baseline-people-alt">Users</bim-label>
                    </li>
                </Router.Link>
                <Router.Link to={'/info'}>
                <li id="info-button">
                    <bim-label style={buttonStyle} icon="octicon:info-16">Info</bim-label>
                </li>
                </Router.Link>
                <Router.Link to={'/viewer'}>
                <li id="viewer-button">
                    <bim-label style={buttonStyle} icon="fluent:warning-24-regular">BIMViewer_TEST</bim-label>
                </li>
                </Router.Link>
            </ul>
            <ul className="nav-buttons" id="nav-buttons-projects" style={{display:'none', borderTop: '2px solid gray', paddingTop: '15px'}}>
                <li onClick={onShowProjectsButtons} id="list-projects-button" style={{marginLeft: '5px', justifyContent: 'space-between'}} value='expanded'>
                    <span className="material-icons-outlined">menu</span>
                    <div>List of projects</div>
                    <span id="compact_all_projects" className="material-icons-outlined" style={{textAlign: 'center'}}>expand_less</span>
                    <span id="expand_all_projects" className="material-icons-outlined" style={{display: 'none', textAlign: 'center'}}>expand_more</span>
                </li>
                {ProjectsButtons}
            </ul>
    </aside>
    )
}