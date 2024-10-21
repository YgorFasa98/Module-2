import * as React from 'react'

export function ProjectCard () {
    return (
    <div className = "project-card">
        <div className="cards-header">
          <p
            style={{ backgroundColor: "${this.color}", borderRadius: 5, padding: 15 }}
          >
            DEF_ACR
          </p>
          <div>
            <h2>
              Default name
            </h2>
            <h4 style={{ color: "rgb(172, 172, 172)" }}>
              Default address
            </h4>
          </div>
        </div>
        <div className="cards-content">
          <div className="cards-property">
            <p className="cards-categories">Project type</p>
            <p>
              Default project type
            </p>
          </div>
          <div className="cards-property">
            <p className="cards-categories">Company name</p>
            <p>
              Default company name
            </p>
          </div>
          <div className="cards-property">
            <p className="cards-categories">Cost</p>
            <p>
              € Default cost
            </p>
          </div>
          <div className="cards-property">
            <p className="cards-categories">Status</p>
            <p>
              Default status
            </p>
          </div>
          <div className="cards-property">
            <p className="cards-categories">Progress</p>
            <p>
              Default progress %
            </p>
          </div>
        </div>
      </div>      
    )
}