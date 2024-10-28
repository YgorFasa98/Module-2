import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import * as Router from 'react-router-dom'

import { Sidebar } from './react-components/Sidebar'
import { ProjectsPage } from './react-components/ProjectsPage'
import { SingleProjectPage } from './react-components/SingleProjectPage'
import { UsersPage } from './react-components/UsersPage'
import { ProjectsManager } from './classes/ProjectsManager'

import { UsersManager } from './classes/UsersManager'

import * as THREE from "three"
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {GUI} from "three/examples/jsm/libs/lil-gui.module.min.js"
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader.js"
import {MTLLoader} from "three/examples/jsm/loaders/MTLLoader.js"


const projectsManager = new ProjectsManager()
const usersManager = new UsersManager()

//#region REACT COMPONENTS
const rootElement = document.getElementById('app') as HTMLDivElement
const appRoot = ReactDOM.createRoot(rootElement)
appRoot.render(
    <>
    <Router.BrowserRouter>
        <Sidebar projectsManager={projectsManager}/>
        <Router.Routes>
            <Router.Route path='/home' element={ <ProjectsPage projectsManager={projectsManager} /> } />
            <Router.Route path='/single-project/:id' element={ <SingleProjectPage projectsManager={projectsManager} /> } />
            <Router.Route path='/users' element={ <UsersPage usersManager={usersManager}/> } />
        </Router.Routes>
    </Router.BrowserRouter>
    </>
)
//#endregion

//#region PROJECTS PAGE EVENTS
//const projectsTodoList = document.getElementById('todo-card-list') as HTMLDivElement
//#endregion


/*
//#region USERS PAGE EVENTS

//#region PROJECT DETAILS PAGE

//#region TO-DO
const todoAddButton = document.getElementById('todo-add') as HTMLElement
const newTodoModal = new toggleModal('new-todo-modal')
const todoFormAccept = document.getElementById("button-todo-form-accept") //accept button
const todoFormCancel = document.getElementById("button-todo-form-cancel") //cancel button
const newTodoForm = document.getElementById("new-todo-form") //form element
if (todoAddButton && todoFormAccept && todoFormCancel && newTodoForm && newTodoForm instanceof HTMLFormElement){
    todoAddButton.addEventListener('click', () => {
        newTodoModal.showModal()
    })
    todoFormAccept.addEventListener('click', (e) => {
        const formData = new FormData(newTodoForm)
        e.preventDefault()
        const todoData: T.ITodo = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            expiredate: new Date (formData.get('expiredate') as string),
            status: formData.get('status') as T.statusTodo,
            priority: formData.get('priority') as T.priorityTodo,
        }
        try {
            //const todo = new T.ToDo(todoData)
            projectsManager.newTodo(todoData)
            newTodoModal.closeModal() //if i want to close or not the form after clicking on accept button
            newTodoForm.reset() //resent the fields of the form
            projectsManager.setUI_error(new Error(''),"none",'new') //display the UI of error
        } catch (err) {
            console.log(err)
            //projectsManager.setUI_error(err,"",'new')
        }
    })
    todoFormCancel.addEventListener('click', (e) => {
        e.preventDefault()
        newTodoModal.closeModal() //close the form
        newTodoForm.reset()
        projectsManager.setUI_error(new Error(''),"none",'new')
    })
}

const updateTodoModal = new toggleModal('edit-todo-modal')
const updateTodoForm = document.getElementById('edit-todo-form') as HTMLFormElement
const updateTodoAccept = document.getElementById('edit-todo-form-accept')
if (updateTodoAccept){
    updateTodoAccept.addEventListener('click', (e) => {
        const formData = new FormData(updateTodoForm)
        e.preventDefault()
        const newData = {
            status: formData.get('status') as T.statusTodo,
            priority: formData.get('priority') as T.priorityTodo
        }
        projectsManager.updateTodo(newData.status,newData.priority)
        updateTodoForm.reset()
        updateTodoModal.closeModal()
    })
}
//#endregion

/*
//#region ThreeJS VIEWER
//scene
const scene = new THREE.Scene()

//viewer container
const viewerContainer = document.getElementById('viewer-container') as HTMLElement

//camera
const camera = new THREE.PerspectiveCamera(75)
camera.position.z = 10

//renderer
const renderer = new THREE.WebGLRenderer({alpha: true, antialias: true})
viewerContainer.append(renderer.domElement)

//resize viewer container dinamically
function resizeViewer(){ //function to resize the renderer and the camera
    const viewerContainerDimensions = viewerContainer.getBoundingClientRect()
    renderer.setSize(viewerContainerDimensions.width,viewerContainerDimensions.height)
    const aspectRatio = viewerContainerDimensions.width / viewerContainerDimensions.height
    camera.aspect = aspectRatio
    camera.updateProjectionMatrix()
}

resizeViewer() //first call of the function to set the elements the first time
window.addEventListener('resize', resizeViewer) //listener to call the function each time the window gets resized

//geometry and mesh
const boxGeometry = new THREE.BoxGeometry()
const torusGeometry = new THREE.TorusGeometry()
const material = new THREE.MeshStandardMaterial()

material.color = new THREE.Color('red')
material.transparent = true
material.opacity = 0.5
material.wireframe = false

const cube = new THREE.Mesh(boxGeometry,material)
const torus = new THREE.Mesh(torusGeometry,material)
torus.position.z = 2

//lights
const ambientLight = new THREE.AmbientLight()
ambientLight.intensity = 0.3
const directionalLight = new THREE.DirectionalLight()
const spotLight = new THREE.SpotLight('#ffffff',3,10,0.4)
spotLight.position.y = 5

//visualization of geometry in the scene
scene.add(cube, torus, ambientLight, directionalLight, spotLight)

//allow user ot move the camera in the scene
const cameraControls = new OrbitControls(camera, viewerContainer)
function renderScene() {
    renderer.render(scene, camera)
    requestAnimationFrame(renderScene)
}
renderScene()

//HELPERS: axes, grid, controls panel
const axes = new THREE.AxesHelper() //axes
const grid = new THREE.GridHelper() //grid
grid.material.transparent = true
grid.material.opacity = 0.4
grid.material.color = new THREE.Color('#ffffff')
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight,0.1) //directional light helper
const spotLightHelper = new THREE.SpotLightHelper(spotLight,0.1) //spot light helper

scene.add(axes,grid,directionalLightHelper,spotLightHelper)

const gui = new GUI() //controls panel

const visibilityControls = gui.addFolder('Visibility')
visibilityControls.add(cube, 'visible').name('Cube')
visibilityControls.add(torus, 'visible').name('Torus')

const elementsPosition = gui.addFolder('Elements position')
const cubeControls = elementsPosition.addFolder('Cube') //cube control
cubeControls.add(cube.position, 'x', -10, 10, 1).name('X')
cubeControls.add(cube.position, 'y', -10, 10, 1).name('Y')
cubeControls.add(cube.position, 'z', -10, 10, 1).name('Z')

const torusControls = elementsPosition.addFolder('Torus')  //torus control
torusControls.add(torus.position, 'x', -10, 10, 1).name('X')
torusControls.add(torus.position, 'y', -10, 10, 1).name('Y')
torusControls.add(torus.position, 'z', -10, 10, 1).name('Z')

const materialControls = gui.addFolder('Material')  //material control
materialControls.add(material, 'transparent').name('Transparency')
materialControls.add(material, 'wireframe').name('Wireframe')
materialControls.add(material, 'opacity', 0, 1, 0.1).name('Opacity')
materialControls.addColor(material, 'color').name('Color')

const gridControls = gui.addFolder('Grid') //grid control
gridControls.add(grid.material, 'transparent').name('Transparency')
gridControls.add(grid.material, 'opacity', 0, 1, 0.1).name('Opacity')
gridControls.addColor(grid.material, 'color').name('Color')

const directionalLightControls = gui.addFolder('Directional light') //lights control
directionalLightControls.add(directionalLightHelper.light.position, 'x', -10, 10, 1).name('X')
directionalLightControls.add(directionalLightHelper.light.position, 'y', -10, 10, 1).name('Y')
directionalLightControls.add(directionalLightHelper.light.position, 'z', -10, 10, 1).name('Z')
directionalLightControls.add(directionalLightHelper.light, 'intensity', -1, 10, 0.1).name('Intensity')
directionalLightControls.addColor(directionalLightHelper.light, 'color').name('Color')

const spotLightControls = gui.addFolder('Spot light') //lights control
spotLightControls.add(spotLightHelper.light.position, 'x', -10, 10, 1).name('X')
spotLightControls.add(spotLightHelper.light.position, 'y', -10, 10, 1).name('Y')
spotLightControls.add(spotLightHelper.light.position, 'z', -10, 10, 1).name('Z')
spotLightControls.add(spotLightHelper.light, 'intensity', -1, 10, 0.1).name('Intensity')
spotLightControls.addColor(spotLightHelper.light, 'color').name('Color')
//spotLightControls.add(spotLightHelper.light, 'angle', 0,1,0.01).name('Angle')


//EXTERNAL GEOMETRY
function LoaderObjMtl(){
    const objLoader = new OBJLoader()
    const mtlLoader = new MTLLoader()

    mtlLoader.load("../assets/Gear/Gear1.mtl", (materials) => {
        materials.preload()
        objLoader.setMaterials(materials)
        objLoader.load("../assets/Gear/Gear1.obj", (mesh) => {
            scene.add(mesh)
            visibilityControls.add(mesh, 'visible').name('Gear')
        })    
    })
}
//LoaderObjMtl()

const uploadGltfButton = document.getElementById("3D-file-upload")
if (uploadGltfButton){
    uploadGltfButton.addEventListener('click', async () => {
        const meshUploaded = await projectsManager.upload3DFile() as any
        scene.add(meshUploaded.mesh)
        visibilityControls.add(meshUploaded.mesh,'visible').name(meshUploaded.fileName)
        const newControls = elementsPosition.addFolder(meshUploaded.fileName)
        newControls.add(meshUploaded.mesh.position, 'x', -50, 50, 1).name('X')
        newControls.add(meshUploaded.mesh.position, 'y', -50, 50, 1).name('Y')
        newControls.add(meshUploaded.mesh.position, 'z', -50, 50, 1).name('Z')
        newControls.add(meshUploaded.mesh.rotation, 'x', -10, 10, 0.1).name('RotX')
        newControls.add(meshUploaded.mesh.rotation, 'y', -10, 10, 0.1).name('RotY')
        newControls.add(meshUploaded.mesh.rotation, 'z', -10, 10, 0.1).name('RotZ')
    })
}

//#endregion
*/