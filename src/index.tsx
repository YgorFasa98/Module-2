import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import * as Router from 'react-router-dom'

import { Sidebar } from './react-components/Sidebar'
import { ProjectsPage } from './react-components/ProjectsPage'
import { SingleProjectPage } from './react-components/SingleProjectPage'
import { UsersPage } from './react-components/UsersPage'
import { InfoPage } from './react-components/InfoPage'
import { TestViewer } from './react-components/TestViewer'

import { ProjectsManager } from './classes/ProjectsManager'
import { UsersManager } from './classes/UsersManager'

import * as BUI from '@thatopen/ui'

//add components in the global interface to not complain typescript
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'bim-grid': any
            'bim-button': any
            'bim-label': any
            'bim-text-input': any
            'bim-icon': any
            'bim-input': any
            'bim-dropdown': any
            'bim-option': any
            'bim-color-input': any
            'bim-number-input': any
            'bim-viewport': any
            'bim-toolbar': any
            'bim-table': any
            'bim-checkbox': any
        }
    }
}
BUI.Manager.init()

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
            <Router.Route path='/info' element={ <InfoPage /> } />
            <Router.Route path='/viewer' element={ <TestViewer /> } />
        </Router.Routes>
    </Router.BrowserRouter>
    </>
)
//#endregion