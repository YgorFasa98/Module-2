import * as React from 'react'
import * as T from '../classes/Todo'
import { Project } from '../classes/Project'
import { ProjectsManager } from '../classes/ProjectsManager'
import { toggleModal } from '../classes/Generic'

interface Props{
    todo: T.ToDo
    project: Project
    projectManager: ProjectsManager
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

    const onDeleteTodoButtonClick = () => {
        const updatedTodoList = props.project.todoList.filter(item => item.id !== props.todo.id);
        props.project.todoList = updatedTodoList
        props.projectManager.updateProject(props.project, props.project.id)
    }

    const [editedTodo, setEditedTodo] = React.useState(props.todo)

    const dialogRef = React.useRef(null) as any
    const onEditTodoButtonClick = () =>{
        dialogRef.current.showModal()
    }

    const editTodoForm = React.useRef(null) as any
    const onEditTodoFormAcceptButtonClick = (e: React.FormEvent) =>{
        //const editTodoForm = document.getElementById('edit-todo-form') as HTMLFormElement
        e.preventDefault()
        const formData = new FormData(editTodoForm.current)
        const newData = {
            status: formData.get('status') as T.statusTodo,
            priority: formData.get('priority') as T.priorityTodo
        }
        props.todo.status = newData.status
        props.todo.priority = newData.priority
        setEditedTodo(new T.ToDo(props.todo))
        const updatedTodoList = props.project.todoList.map(item => item.id === props.todo.id ? {...item, status: newData.status, priority: newData.priority} : item)
        props.project.todoList = updatedTodoList
        props.projectManager.updateProject(props.project, props.project.id)
        dialogRef.current.close()
    }

    return(
        <div
            className='to-do-card' 
            style={{backgroundColor: props.todo.colorPriority}}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            >
            <dialog id="edit-todo-modal" ref={dialogRef}>
                <div id="edit-todo-dialog">
                <form id="edit-todo-form" ref={editTodoForm}>
                    <h2>Edit To-Do: change status or/and priority</h2>
                    <div className="input-list">
                    <div className="field-container">
                        <label className="field-title">
                        <span className="material-icons-outlined form-icons">update</span>
                        Status
                        </label>
                        <select name="status" defaultValue={editedTodo.status}>
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
                        <select name="priority" defaultValue={editedTodo.priority}>
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
                        onClick={(e) => {onEditTodoFormAcceptButtonClick(e)}}
                    >
                        Accept
                    </button>
                    </div>
                </form>
                <div id="new-project-error-tab" style={{ display: "none" }} />
                </div>
            </dialog>
            <span
                id="deletetodo"
                className="material-icons-outlined edittodo"
                style={{
                display: hover ? '' : 'none',
                backgroundColor: "var(--background)",
                borderRadius: 5,
                padding: 10
                }}
                onClick={onDeleteTodoButtonClick}
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
                onClick={onEditTodoButtonClick}
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

