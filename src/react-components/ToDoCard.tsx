import * as React from 'react'
import { ToDo } from '../classes/Todo'

interface Props{
    todo: ToDo
}

export function ToDoCard (props:Props) {

    if (props.todo.priority=='Low'){props.todo.colorPriority='#a9c167'}
    else if (props.todo.priority=='Medium'){props.todo.colorPriority='#ffe45c'}
    else if (props.todo.priority=='High'){props.todo.colorPriority='#dd994b'}
    else if (props.todo.priority=='Very high'){props.todo.colorPriority='#b83232'}

    if (props.todo.status=='Active'){props.todo.colorStatus='#ff0000'; props.todo.symbolStatus='priority_high'}
    else if (props.todo.status=='Closed'){props.todo.colorStatus='#a0a0a0'; props.todo.colorPriority='#a0a0a0'; props.todo.symbolStatus='close'}
    else if (props.todo.status=='Pause'){props.todo.colorStatus='#ffff00'; props.todo.symbolStatus='pause'}
    else if (props.todo.status=='Resolved'){props.todo.colorStatus='#009900'; props.todo.symbolStatus='done'}

    const [hover, setHover] = React.useState(false);

    return(
        <div
            className='to-do-card' 
            style={{backgroundColor: props.todo.colorPriority}}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            >
            <span
                id="deletetodo"
                className="material-icons-outlined edittodo"
                style={{
                display: hover ? '' : 'none',
                backgroundColor: "var(--background)",
                borderRadius: 5,
                padding: 10
                }}
            >
                delete
            </span>
            <span
                id="edittodo"
                className="material-icons-outlined edittodo"
                style={{
                display: hover ? '' : 'none',
                backgroundColor: "var(--background)",
                borderRadius: 5,
                padding: 10
                }}
            >
                edit
            </span>
            <div
                id="infos"
                style={{
                display: hover ? 'none' : "flex",
                gap: 15,
                flexDirection: "row",
                alignItems: "center",
                }}
            >
                <span
                id="construction"
                className="material-icons-outlined"
                style={{
                    backgroundColor: "var(--background)",
                    borderRadius: 5,
                    padding: 10,
                    border: "2px solid transparent"
                }}
                >
                {props.todo.symbolStatus}
                </span>
                <div id="text" style={{ display: "flex", flexDirection: "column" }}>
                <h3>
                    {props.todo.title}
                </h3>
                <h4 style={{ marginRight: 10 }}>
                    {props.todo.description}
                </h4>
                </div>
            </div>
            <div id="date" style={{display: hover ? 'none' : ''}}>
                {props.todo.expiredate.toLocaleDateString('en-UK', {day: '2-digit', month:'short', year: 'numeric'})}
            </div>
        </div>
    )
}

