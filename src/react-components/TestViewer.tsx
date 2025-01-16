
import { BIMViewer } from './BIMViewer'
import { BIMViewer_v2 } from './BIMViewer_v2'
import { BIMViewer_v3 } from './BIMViewer_v3'
import { BIMViewer_v4 } from './BIMViewer_v4'
import * as React from 'react'

export function TestViewer () {
    return(
        <div className="main-page-content" 
        style={{display: 'grid', gridTemplateColumns: '400px 1fr'}}>
            <div id = 'sx-bar'>
                <div id='sx-bar-project-details'>
                </div>
                <div id='sx-bar-todos'>
                </div>
            </div>
            <BIMViewer/>
        </div>
    )
}