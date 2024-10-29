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

    React.useEffect(() => {
        //console.log('Button list updated', projects)
    }, [projects])
    //#endregion

    //hide or show projects buttons in home page or other pages
    const routePath = Router.useLocation().pathname
    const listOfProjects = document.getElementById("nav-buttons-projects")
    if (listOfProjects){
        if(routePath == '/home' || routePath == '/users'){
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


    return(
        <aside id="sidebar">
            <div style={{display: 'flex', 'flexDirection': 'column', alignItems: 'center'}}>
                <img id="company-logo" src="assets/logo.svg" alt="Missed image reference" style={{width: '100px', height: '100px', paddingTop: '20px'}} />
            </div>
                B  I  M 
            <ul className="nav-buttons" id="nav-buttons-home">
                <Router.Link to='/home'>
                    <li id="home-button">
                        <span className="material-icons-outlined">maps_home_work</span>
                        <div>Projects Home</div>
                    </li>
                </Router.Link>                
                <Router.Link to='/users'>
                    <li id="users-button">
                        <span className="material-icons-outlined">person</span>
                        <div>Users</div>
                    </li>
                </Router.Link>
                <li id="info-button">
                    <span className="material-icons-outlined">info</span>
                    <div>Info</div>
                </li>
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