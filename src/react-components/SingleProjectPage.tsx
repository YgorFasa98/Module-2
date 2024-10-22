import * as React from 'react'

export function SingleProjectPage () {
    return(
        <div id="single-project-page" className="page">
            <dialog id="edit-project-modal">
                <div id="edit-project-dialog">
                <form id="edit-project-form">
                    <h2>Edit Project</h2>
                    <div className="input-list">
                    <div className="field-container">
                        <label className="field-title">
                        <span className="material-symbols-outlined">abc</span>
                        Acronym
                        </label>
                        <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 60px",
                            alignItems: "center"
                        }}
                        >
                        <input
                            name="acronym"
                            size={30}
                            style={{ resize: "none" }}
                            maxLength={4}
                        />
                        <input
                            name="color"
                            id="color"
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
                        <option value=''>Completed</option>
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
                            <output
                            name="progress-output"
                            className="progress-value"
                            htmlFor="progress-bar"
                            >
                            50
                            </output>{" "}
                            %
                        </p>
                        </div>
                    </div>
                    </div>
                    <div className="buttons">
                    <button
                        type="submit"
                        id="button-editproject-form-save"
                        className="generic-buttons"
                    >
                        Save
                    </button>
                    </div>
                </form>
                <div id="edit-project-error-tab" style={{ display: "none" }} />
                </div>
            </dialog>
            <dialog id="new-todo-modal">
                <div id="new-todo-dialog">
                <form id="new-todo-form">
                    <h2>New To-Do</h2>
                    <div className="input-list">
                    <div className="field-container">
                        <label className="field-title">
                        <span className="material-symbols-outlined form-icons">
                            location_away
                        </span>
                        Title
                        </label>
                        <input name="title" type="text" />
                    </div>
                    <div className="field-container" style={{ marginLeft: 25 }}>
                        <label className="field-title">
                        <span className="material-icons-outlined form-icons">menu</span>
                        Description
                        </label>
                        <textarea
                        name="description"
                        cols={30}
                        rows={5}
                        placeholder=" Introduct yourself (max 300 characters)..."
                        style={{ resize: "none" }}
                        maxLength={300}
                        defaultValue={""}
                        />
                    </div>
                    <div className="field-container" style={{ marginLeft: 25 }}>
                        <label className="field-title">
                        <span className="material-icons-outlined form-icons">event</span>
                        Expire date
                        </label>
                        <input name="expiredate" type="date" className="date" />
                    </div>
                    <div className="field-container" style={{ marginLeft: 25 }}>
                        <label className="field-title">
                        <span className="material-icons-outlined form-icons">update</span>
                        Status
                        </label>
                        <select name="status">
                        <option>Active</option>
                        <option>Pause</option>
                        <option>Resolved</option>
                        <option>Closed</option>
                        </select>
                    </div>
                    <div className="field-container" style={{ marginLeft: 25 }}>
                        <label className="field-title">
                        <span className="material-icons-outlined form-icons">update</span>
                        Priority
                        </label>
                        <select name="priority">
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                        <option>Very high</option>
                        </select>
                    </div>
                    </div>
                    <div className="buttons">
                    <button
                        type="button"
                        id="button-todo-form-cancel"
                        className="generic-buttons"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        id="button-todo-form-accept"
                        className="generic-buttons"
                    >
                        Accept
                    </button>
                    </div>
                </form>
                <div id="new-project-error-tab" style={{ display: "none" }} />
                </div>
            </dialog>
            <dialog id="edit-todo-modal">
                <div id="edit-todo-dialog">
                <form id="edit-todo-form">
                    <h2>Edit To-Do: change status or/and priority</h2>
                    <div className="input-list">
                    <div className="field-container">
                        <label className="field-title">
                        <span className="material-icons-outlined form-icons">update</span>
                        Status
                        </label>
                        <select name="status">
                        <option>Active</option>
                        <option>Pause</option>
                        <option>Resolved</option>
                        <option>Closed</option>
                        </select>
                    </div>
                    <div className="field-container">
                        <label className="field-title">
                        <span className="material-icons-outlined form-icons">update</span>
                        Priority
                        </label>
                        <select name="priority">
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                        <option>Very high</option>
                        </select>
                    </div>
                    </div>
                    <div className="buttons">
                    <button
                        type="submit"
                        id="edit-todo-form-accept"
                        className="generic-buttons"
                    >
                        Accept
                    </button>
                    </div>
                </form>
                <div id="new-project-error-tab" style={{ display: "none" }} />
                </div>
            </dialog>
            <header className="single-project-page-spaces">
                <h1 data-project-details-info="title-name">Hospital Center</h1>
                <h4
                style={{ color: "rgb(115, 115, 115)" }}
                data-project-details-info="title-address"
                >
                Address of the project
                </h4>
            </header>
            <div className="main-page-content">
                <div
                id="sx-bar"
                className="single-project-page-spaces"
                style={{ padding: 0, backgroundColor: "transparent", gap: 10 }}
                >
                <div
                    className="single-project-page-spaces dash-card"
                    style={{ margin: 0 }}
                >
                    <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}
                    >
                    <p
                        data-project-details-info="acronym"
                        style={{
                        backgroundColor: "brown",
                        borderRadius: 10,
                        padding: 15,
                        fontSize: 24
                        }}
                    >
                        CR
                    </p>
                    <button id="edit-button">Edit</button>
                    </div>
                    <div style={{ borderBottom: "1px solid white", paddingBottom: 5 }}>
                    <h3 data-project-details-info="name">Hospital Center</h3>
                    <p data-project-details-info="address">Address</p>
                    </div>
                    <div id="details">
                    <div style={{ marginLeft: 5, marginRight: 5 }}>
                        <p style={{ color: "dimgray" }}>Company</p>
                        <p data-project-details-info="company">XXX</p>
                    </div>
                    <div style={{ marginLeft: 5, marginRight: 5 }}>
                        <p style={{ color: "dimgray" }}>Project type</p>
                        <p data-project-details-info="project-type">XXX</p>
                    </div>
                    <div style={{ marginLeft: 5, marginRight: 5 }}>
                        <p style={{ color: "dimgray" }}>Status</p>
                        <p data-project-details-info="status">XXX</p>
                    </div>
                    <div style={{ marginLeft: 5, marginRight: 5 }}>
                        <p style={{ color: "dimgray" }}>Cost</p>
                        <p data-project-details-info="cost">€ XXX</p>
                    </div>
                    </div>
                    <div>
                    <p style={{ color: "dimgray", marginBottom: 5 }}>Progress bar</p>
                    <div className="loading-bar-container">
                        <div data-project-details-info="progress" className="loading-bar">
                        1%
                        </div>
                    </div>
                    </div>
                </div>
                <div
                    className="single-project-page-spaces todo-list"
                    style={{ flexGrow: 1, margin: 0, rowGap: 20 }}
                >
                    <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between"
                    }}
                    >
                    <h2>To-Do</h2>
                    <div
                        style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 5
                        }}
                    >
                        <span
                        id="todo-search"
                        className="material-icons-outlined generic-buttons"
                        >
                        search
                        </span>
                        <textarea
                        maxLength={20}
                        className="search-bar"
                        cols={25}
                        rows={1}
                        placeholder="Search by name (max 20 ch)"
                        defaultValue={""}
                        />
                        <span
                        id="todo-add"
                        className="material-icons-outlined generic-buttons"
                        >
                        add
                        </span>
                    </div>
                    </div>
                    <div
                    id="todo-card-list"
                    className="card-list"
                    style={{
                        margin: 0,
                        overflowY: "auto",
                        height: 100,
                        display: "flex",
                        flexDirection: "column",
                        rowGap: 20,
                        flexGrow: 1
                    }}
                    >
                    <div className="to-do-card">
                        <div
                        style={{
                            display: "flex",
                            gap: 15,
                            flexDirection: "row",
                            alignItems: "center"
                        }}
                        >
                        <span
                            id="construction"
                            className="material-icons-outlined"
                            style={{
                            backgroundColor: "gray",
                            borderRadius: 5,
                            padding: 10
                            }}
                        >
                            construction
                        </span>
                        This is the first thing to do on this project.
                        <br />
                        Second line of first thing.This is the first thing to do on this
                        project.
                        </div>
                        <div>Fri, 20 ago</div>
                    </div>
                    <div className="to-do-card">
                        <div
                        style={{
                            display: "flex",
                            gap: 15,
                            flexDirection: "row",
                            alignItems: "center"
                        }}
                        >
                        <span
                            id="construction"
                            className="material-icons-outlined"
                            style={{
                            backgroundColor: "gray",
                            borderRadius: 5,
                            padding: 10
                            }}
                        >
                            construction
                        </span>
                        This is the second thing to do on this project
                        </div>
                        <div>Thu, 12 feb</div>
                    </div>
                    </div>
                </div>
                </div>
                <div
                id="bow-viewer"
                className="single-project-page-spaces viewer-container"
                >
                <ul
                    id="viewer-bar"
                    style={{ padding: 5, borderRight: "2px solid black" }}
                >
                    <li
                    id="3D-file-upload"
                    className="generic-buttons"
                    style={{ textAlign: "center" }}
                    >
                    <span className="material-icons-outlined">upload</span>
                    <h5>OBJ</h5>
                    <h5>GLTF</h5>
                    </li>
                </ul>
                <div
                    id="viewer-container"
                    className="single-project-page-spaces viewer-container"
                    style={{ backgroundColor: "transparent", width: "100%", margin: 0 }}
                />
                </div>
            </div>
        </div>
    )
}