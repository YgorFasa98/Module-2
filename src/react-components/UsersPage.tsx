import * as React from 'react'

export function UsersPage () {
    return(
        <div id="users-page" className="page" style={{ display: "none" }}>
            <dialog id="new-user-modal">
                <div id="new-user-dialog">
                <form id="new-user-form">
                    <h2>New User</h2>
                    <div className="input-list">
                    <div className="field-container">
                        <label className="field-title">
                        <span className="material-icons-outlined form-icons">badge</span>
                        Name
                        </label>
                        <input id="category-name" type="text" name="name" />
                        <div style={{ fontSize: 15, fontStyle: "italic", padding: 5 }}>
                        Insert name and surname
                        </div>
                    </div>
                    <div className="field-container">
                        <label className="field-title">
                        <span className="material-icons-outlined form-icons">
                            alternate_email
                        </span>
                        E-mail
                        </label>
                        <input name="email" type="text" />
                    </div>
                    <div className="field-container">
                        <label className="field-title">
                        <span className="material-icons-outlined form-icons">
                            engineering
                        </span>
                        Role
                        </label>
                        <select name="role">
                        <option>Engineer</option>
                        <option>Architect</option>
                        <option>BIM manager</option>
                        <option>BIM coordinator</option>
                        <option>BIM specialist</option>
                        </select>
                    </div>
                    <div className="field-container">
                        <label className="field-title">
                        <span className="material-icons-outlined form-icons">
                            more_horiz
                        </span>
                        Other informations
                        </label>
                    </div>
                    <div className="field-container" style={{ marginLeft: 25 }}>
                        <label className="field-title">
                        <span className="material-icons-outlined form-icons">menu</span>
                        Self description
                        </label>
                        <textarea
                        name="selfDescription"
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
                        <span className="material-icons-outlined form-icons">
                            transgender
                        </span>
                        Gender
                        </label>
                        <fieldset
                        style={{ display: "flex", flexDirection: "row", gap: 25 }}
                        >
                        <label>
                            <input name="gender" type="radio" defaultValue="Male" /> Male
                        </label>
                        <label>
                            <input name="gender" type="radio" defaultValue="Female" />{" "}
                            Female
                        </label>
                        <label>
                            <input name="gender" type="radio" defaultValue="Other" /> Other
                        </label>
                        </fieldset>
                    </div>
                    <div className="field-container" style={{ marginLeft: 25 }}>
                        <label className="field-title">
                        <span className="material-icons-outlined form-icons">event</span>
                        Birthday date
                        </label>
                        <input name="birthday" type="date" className="date" />
                    </div>
                    <div className="field-container" style={{ marginLeft: 25 }}>
                        <label className="field-title">
                        <span className="material-icons-outlined form-icons">home</span>
                        Address
                        </label>
                        <input name="address" type="address" />
                    </div>
                    <div className="field-container" style={{ marginLeft: 25 }}>
                        <label className="field-title">
                        <span className="material-icons-outlined form-icons">
                            business
                        </span>
                        Company name
                        </label>
                        <input name="companyName" type="text" />
                    </div>
                    </div>
                    <div className="buttons">
                    <button
                        type="button"
                        id="button-user-form-cancel"
                        className="generic-buttons"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        id="button-user-form-accept"
                        className="generic-buttons"
                    >
                        Accept
                    </button>
                    </div>
                </form>
                <div id="new-user-error-tab" style={{ display: "none" }} />
                </div>
            </dialog>
            <dialog className="error-import" id="error-import-user"></dialog>
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
                    person
                </span>
                <h1 id="manageUsersTitle" style={{ fontFamily: "Roboto", color: "gray" }}>
                    Manage Users (default value)
                </h1>
                </div>
                <div id="users-page-addbar">
                <button id="new-user-button">
                    <span
                    id="add"
                    className="material-icons-outlined generic-buttons"
                    style={{ backgroundColor: "transparent", padding: 0 }}
                    >
                    person_add_alt
                    </span>
                    <h3>New User</h3>
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
                    id="user-upload"
                    className="material-icons-outlined generic-buttons"
                    >
                    upload
                    </span>
                    <span
                    id="user-download"
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
                <div id="meanAge" style={{ padding: 20 }}>
                <div>
                    Users mean age test: 26 years
                    <h3 style={{ fontWeight: "normal" }} />
                </div>
                </div>
            </header>
            <div id="users-page-content">
                <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "50px 300px 400px 1fr 50px",
                    marginLeft: 30,
                    gap: 20,
                    padding: 5,
                    marginRight: 25
                }}
                >
                <h3 style={{ color: "gray" }} />
                <h3 style={{ color: "gray" }}>Name</h3>
                <h3 style={{ color: "gray" }}>E-mail</h3>
                <h3 style={{ color: "gray" }}>Role</h3>
                <span
                    id="compact_all"
                    className="material-icons-outlined generic-buttons"
                    style={{ display: "none", textAlign: "center" }}
                >
                    expand_less
                </span>
                <span
                    id="expand_all"
                    className="material-icons-outlined generic-buttons"
                    style={{ textAlign: "center" }}
                >
                    expand_more
                </span>
                </div>
                <ul className="card-list" id="users-list"></ul>
            </div>
        </div>
    )
}