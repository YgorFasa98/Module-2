import * as React from 'react'
import * as P from '../classes/Project'
import * as Router from 'react-router-dom'
import { color } from 'three/examples/jsm/nodes/Nodes.js'

interface Props {
  project: P.Project
}

export function ProjectCard (props:Props) {
  const acronymStyle = {
    backgroundColor: props.project.color, 
    borderRadius: 5, 
    padding: 15, 
    color: 'white', 
    fontSize: '20px'    
  }
  const categoriesStyle = {
    color: 'darkgray',
    fontSize: '12px'
  }
  const detailsStyle = {
    color: 'white',
    fontSize: '15px'
  }
  const projectTitle = {
    color: 'white',
    fontSize: '20px'
  }
  const projectAddress = {
    color: 'darkgray',
    fontSize: '15px'
  }

  return (
    <Router.Link to={`/single-project/${props.project.id}`}>
      <div className = "project-card">
        <div className="cards-header">
          <bim-label style={acronymStyle}> {props.project.acronym} </bim-label>
          <div>
            <bim-label style={projectTitle}> {props.project.name} </bim-label>
            <bim-label style={projectAddress}> {props.project.address} </bim-label>
          </div>
        </div>
        <div className="cards-content">
          <div className="cards-property">
            <bim-label style={categoriesStyle}>Project type</bim-label>
            <bim-label style={detailsStyle}> {props.project.projectType} </bim-label>
          </div>
          <div className="cards-property">
            <bim-label style={categoriesStyle}>Company name</bim-label>
            <bim-label style={detailsStyle}> {props.project.companyName} </bim-label>
          </div>
          <div className="cards-property">
            <bim-label style={categoriesStyle}>Cost</bim-label>
            <bim-label style={detailsStyle}> € {props.project.cost} </bim-label>
          </div>
          <div className="cards-property">
            <bim-label style={categoriesStyle}>Status</bim-label>
            <bim-label style={detailsStyle}> {props.project.status} </bim-label>
          </div>
          <div className="cards-property">
            <bim-label style={categoriesStyle}>Progress</bim-label>
            <bim-label style={detailsStyle}> {props.project.progress} % </bim-label>
          </div>
        </div>
      </div>
    </Router.Link>    
    )
}