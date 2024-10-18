import * as React from 'react'

export function ProjectsPage () {
<<<<<<< HEAD
  const tipStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 60px",
    alignItems: "center"
  }
=======
>>>>>>> 4ba046ab74fcdccf0d9ab59508fd1a7d28362f57
    return(
    <div id="project-main-page" className="page" style={{ display: '""' }}>
        <dialog id="new-project-modal">
          <div id="new-project-dialog">
            <form id="new-project-form">
              <h2>New Project</h2>
              <div className="input-list">
                <div className="field-container">
                  <label className="field-title">
                    <span className="material-symbols-outlined">abc</span>
                    Acronym
                  </label>
                  <div
<<<<<<< HEAD
                    style={tipStyle}
=======
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 60px",
                      alignItems: "center"
                    }}
>>>>>>> 4ba046ab74fcdccf0d9ab59508fd1a7d28362f57
                  >
                    <input
                      name="acronym"
                      size={30}
                      style={{ resize: "none" }}
                      maxLength={4}
                    />
                    <input
                      id="color"
                      name="color"
                      type="color"
                      defaultValue="#931f1f"
                      style={{
                        backgroundColor: "transparent",
                        padding: 0,
                        marginLeft: 10,
                        height: 50
                      }}
                    />
                  </div>
                  <div style={{ fontSize: 15, fontStyle: "italic", padding: 5 }}>
                    Insert an abbreviation of project's name (max 4 characters, i.e.:
                    SFH)
                  </div>
                </div>
                <div className="field-container">
                  <label className="field-title">
                    <span className="material-symbols-outlined form-icons">
                      location_away
                    </span>
                    Project name
                  </label>
                  <input name="name" type="text" />
                </div>
                <div className="field-container">
                  <label className="field-title">
                    <span className="material-icons-outlined form-icons">
                      home_work
                    </span>
                    Project type
                  </label>
                  <input name="projectType" type="text" />
                </div>
                <div className="field-container">
                  <label className="field-title">
                    <span className="material-icons-outlined form-icons">home</span>
                    Address
                  </label>
                  <input name="address" type="address" />
                </div>
                <div className="field-container">
                  <label className="field-title">
                    <span className="material-icons-outlined form-icons">
                      business
                    </span>
                    Company name
                  </label>
                  <input name="companyName" type="text" />
                </div>
                <div className="field-container">
                  <label className="field-title">
                    <span className="material-icons-outlined form-icons">update</span>
                    Status
                  </label>
                  <select name="status">
                    <option>Active</option>
                    <option>Not started</option>
                    <option>Completed</option>
                    <option>Stopped</option>
                    <option>Dismissed</option>
                  </select>
                </div>
                <div className="field-container">
                  <label className="field-title">
                    <span className="material-icons-outlined form-icons">euro</span>
                    Total cost
                  </label>
                  <input name="cost" type="number" defaultValue={0} />
                </div>
                <div className="field-container">
                  <label className="field-title">
                    <span className="material-icons-outlined form-icons">
                      rotate_right
                    </span>
                    Progress
                  </label>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}
                  >
                    <input
                      className="progress-bar"
                      name="progress"
                      type="range"
                      min={0}
                      max={100}
                      defaultValue={50}
                      style={{ width: "85%", height: 18 }}
                    />
                    <p style={{ marginRight: 10 }}>
                      <output className="progress-value" htmlFor="progress-bar">
                        50
                      </output>{" "}
                      %
                    </p>
                  </div>
                </div>
              </div>
              <div className="buttons">
                <button
                  type="button"
                  id="button-project-form-cancel"
                  className="generic-buttons"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="button-project-form-accept"
                  className="generic-buttons"
                >
                  Accept
                </button>
              </div>
            </form>
            <div id="new-project-error-tab" style={{ display: "none" }} />
          </div>
        </dialog>
        <dialog className="error-import" id="error-import-project"></dialog>
        <header id="header">
          <div
            style={{
              gap: 10,
              marginBottom: 0,
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <span
              className="material-icons-outlined"
              style={{ color: "gray", fontSize: 40 }}
            >
              house
            </span>
            <h1 id="ProjectsTitle" style={{ fontFamily: "Roboto", color: "gray" }}>
              Projects (default value)
            </h1>
          </div>
          <div
            id="project-page-addbar"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10
            }}
          >
            <button id="new-project-button">
              <span
                id="add"
                className="material-icons-outlined generic-buttons"
                style={{ backgroundColor: "transparent", padding: 0 }}
              >
                add
              </span>
              <h3>New Project</h3>
            </button>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 5
              }}
            >
              <span
                id="project-upload"
                className="material-icons-outlined generic-buttons"
              >
                upload
              </span>
              <span
                id="project-download"
                className="material-icons-outlined generic-buttons"
              >
                download
              </span>
              <div style={{ width: 10 }} />
              <textarea
                style={{ margin: 0 }}
                maxLength={20}
                className="search-bar"
                cols={40}
                rows={1}
                placeholder="Search by name (max 20 ch)"
                defaultValue={""}
              />
              <span id="search" className="material-icons-outlined generic-buttons">
                search
              </span>
            </div>
          </div>
        </header>
        <div
          className="card-list"
          style={{ flexGrow: 1, overflow: "auto", marginTop: 30, padding: 5 }}
        >
          <div className="project-list" id="project-list">
          </div>
        </div>
      </div>      
    )
}