import * as React from 'react'
import * as P from '../classes/Project'
import * as Router from 'react-router-dom'

interface Props {
  project: P.Project
}

export function ProjectCard (props:Props) {
  
  return (
    <Router.Link to='/single-project'>
      <div className = "project-card">
        <div className="cards-header">
          <p
            style={{ backgroundColor: props.project.color, borderRadius: 5, padding: 15 }}
          >
            {props.project.acronym}
          </p>
          <div>
            <h2>
              {props.project.name}
            </h2>
            <h4 style={{ color: "rgb(172, 172, 172)" }}>
              {props.project.address}
            </h4>
          </div>
        </div>
        <div className="cards-content">
          <div className="cards-property">
            <p className="cards-categories">Project type</p>
            <p>
              {props.project.projectType}
            </p>
          </div>
          <div className="cards-property">
            <p className="cards-categories">Company name</p>
            <p>
              {props.project.companyName}
            </p>
          </div>
          <div className="cards-property">
            <p className="cards-categories">Cost</p>
            <p>
              € {props.project.cost}
            </p>
          </div>
          <div className="cards-property">
            <p className="cards-categories">Status</p>
            <p>
            {props.project.status}
            </p>
          </div>
          <div className="cards-property">
            <p className="cards-categories">Progress</p>
            <p>
            {props.project.progress} %
            </p>
          </div>
        </div>
      </div>
    </Router.Link>    
    )
}