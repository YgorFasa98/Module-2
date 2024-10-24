import * as React from 'react'
import * as Router from 'react-router-dom'
import * as P from '../classes/Project'

interface Props {
    project: P.Project
}

export function ProjectButton (props:Props) {
    return(
        <Router.Link to={`/single-project/${props.project.id}`}>
            <li className='single-project-button'>
                <p
                    data-project-details-info="acronym"
                    style={{ backgroundColor: props.project.color }}
                >
                    {props.project.acronym}
                </p>
                <div>
                    {props.project.name}
                </div>
            </li>
        </Router.Link>
    )
}