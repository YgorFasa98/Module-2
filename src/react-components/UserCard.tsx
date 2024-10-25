import * as React from'react'
import { User } from '../classes/User'

interface Props {
    user: User
    cardVersion: string
}

export function UserCard (props:Props) {
    const templateUI_compactUser = () => {
        return (
            <li id='user-card-compact-id' className='user-card'>
                <div id="user-compact">
                    <div
                    className="user-image"
                    style={{ backgroundImage: `url(${props.user.userImage})` }}
                    />
                    <p>
                    {props.user.name}
                    </p>
                    <p>
                    {props.user.email}
                    </p>
                    <p>
                    {props.user.role}
                    </p>
                    <span
                    id="expand_more"
                    style={{ marginLeft: 10, padding: 10 }}
                    className="material-icons-outlined"
                    >
                    expand_more
                    </span>
                </div>
        </li>
        )
    }

    const templateUI_expandedUser = () => {
        return (
            <li id='user-card-expanded-id' className='user-card user-card-expanded'>
                <div id="user-compact">
                <div
                    className="user-image"
                    style={{ backgroundImage: `url(${props.user.userImage})` }}
                    />
                    <p>
                    {props.user.name}
                    </p>
                    <p>
                    {props.user.email}
                    </p>
                    <p>
                    {props.user.role}
                    </p>
                    <span
                    id="expand_more"
                    style={{ marginLeft: 10, padding: 10 }}
                    className="material-icons-outlined"
                    >
                    expand_less
                    </span>
                </div>
                <div id="users-details">
                    <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "250px 1fr",
                        paddingRight: 20
                    }}
                    >
                    <p style={{ color: "gray" }}>Description</p>
                    <p>
                        {props.user.selfDescription}
                    </p>
                    </div>
                    <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "250px 1fr",
                        paddingRight: 20
                    }}
                    >
                    <p style={{ color: "gray" }}>Gender</p>
                    <p>
                        {props.user.gender}
                    </p>
                    </div>
                    <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "250px 1fr",
                        paddingRight: 20
                    }}
                    >
                    <p style={{ color: "gray" }}>Birthday date</p>
                    <p>
                        {props.user.birthday.toLocaleDateString('en-UK',{day:'2-digit',month: 'long',year: 'numeric'})}
                    </p>
                    </div>
                    <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "250px 1fr",
                        paddingRight: 20
                    }}
                    >
                    <p style={{ color: "gray" }}>Address</p>
                    <p>
                        {props.user.address}
                    </p>
                    </div>
                    <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "250px 1fr",
                        paddingRight: 20
                    }}
                    >
                    <p style={{ color: "gray" }}>Company name</p>
                    <p>
                        {props.user.companyName}
                    </p>
                    </div>
                </div>
            </li>
        )
    }
    if (props.cardVersion == 'expanded'){
        return(templateUI_expandedUser())
    }
    if (props.cardVersion == 'compact'){
        return(templateUI_compactUser())
    }
}