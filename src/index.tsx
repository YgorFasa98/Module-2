import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import * as Router from 'react-router-dom'

import { Sidebar } from './react-components/Sidebar'
import { ProjectsPage } from './react-components/ProjectsPage'
import { SingleProjectPage } from './react-components/SingleProjectPage'
import { UsersPage } from './react-components/UsersPage'
import { ProjectsManager } from './classes/ProjectsManager'

import { UsersManager } from './classes/UsersManager'


const projectsManager = new ProjectsManager()
const usersManager = new UsersManager()

//#region REACT COMPONENTS
const rootElement = document.getElementById('app') as HTMLDivElement
const appRoot = ReactDOM.createRoot(rootElement)
appRoot.render(
    <>
    <Router.BrowserRouter>
        <Sidebar projectsManager={projectsManager}/>
        <Router.Routes>
            <Router.Route path='/home' element={ <ProjectsPage projectsManager={projectsManager} /> } />
            <Router.Route path='/single-project/:id' element={ <SingleProjectPage projectsManager={projectsManager} /> } />
            <Router.Route path='/users' element={ <UsersPage usersManager={usersManager}/> } />
        </Router.Routes>
    </Router.BrowserRouter>
    </>
)
//#endregion