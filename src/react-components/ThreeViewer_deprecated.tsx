import * as React from 'react'

import * as THREE from "three"
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {GUI} from "three/examples/jsm/libs/lil-gui.module.min.js"
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader.js"
import {MTLLoader} from "three/examples/jsm/loaders/MTLLoader.js"

import { ProjectsManager } from '../classes/ProjectsManager'
import { upload3DFile } from '../classes/Generic'

interface Props {
    projectsManager: ProjectsManager
}

export function ThreeViewer (props:Props) {

    let scene: THREE.Scene | null
    let mesh: THREE.Object3D | null
    let renderer: THREE.WebGLRenderer | null
    let camera: THREE.PerspectiveCamera | null
    let cameraControls: OrbitControls | null
    let axes: THREE.AxesHelper | null
    let grid: THREE.GridHelper | null
    let ambientLight: THREE.AmbientLight | null
    let directionalLight: THREE.DirectionalLight | null
    let spotLight: THREE.SpotLight | null
    let directionalLightHelper: THREE.DirectionalLightHelper | null
    let spotLightHelper: THREE.SpotLightHelper | null
    let objLoader: OBJLoader | null
    let mtlLoader: MTLLoader | null
    
    const setViewer = () => {

        //scene
        scene = new THREE.Scene()

        //viewer container
        const viewerContainer = document.getElementById('viewer-container') as HTMLElement

        //camera
        camera = new THREE.PerspectiveCamera(75)
        camera.position.z = 10

        //renderer
        renderer = new THREE.WebGLRenderer({alpha: true, antialias: true})
        viewerContainer.append(renderer.domElement)

        //resize viewer container dinamically
        function resizeViewer(){ //function to resize the renderer and the camera
            if (!renderer || !camera) return
            const viewerContainerDimensions = viewerContainer.getBoundingClientRect()
            renderer.setSize(viewerContainerDimensions.width,viewerContainerDimensions.height)
            const aspectRatio = viewerContainerDimensions.width / viewerContainerDimensions.height
            camera.aspect = aspectRatio
            camera.updateProjectionMatrix()
        }

        resizeViewer() //first call of the function to set the elements the first time
        window.addEventListener('resize', resizeViewer) //listener to call the function each time the window gets resized

        //lights
        ambientLight = new THREE.AmbientLight()
        ambientLight.intensity = 0.3
        directionalLight = new THREE.DirectionalLight()
        spotLight = new THREE.SpotLight('#ffffff',3,10,0.4)
        spotLight.position.y = 5

        //visualization of geometry in the scene
        scene.add(ambientLight, directionalLight, spotLight)

        //allow user ot move the camera in the scene
        cameraControls = new OrbitControls(camera, viewerContainer)
        function renderScene() {
            if (!scene || !renderer || !camera) return
            renderer.render(scene, camera)
            requestAnimationFrame(renderScene)
        }
        renderScene()

        //HELPERS: axes, grid, controls panel
        axes = new THREE.AxesHelper() //axes
        grid = new THREE.GridHelper() //grid
        grid.material.transparent = true
        grid.material.opacity = 0.4
        grid.material.color = new THREE.Color('#ffffff')
        directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight,0.1) //directional light helper
        spotLightHelper = new THREE.SpotLightHelper(spotLight,0.1) //spot light helper

        scene.add(axes,grid,directionalLightHelper,spotLightHelper)

        //EXTERNAL GEOMETRY
        function LoaderObjMtl(){
            objLoader = new OBJLoader()
            mtlLoader = new MTLLoader()

            mtlLoader.load("../assets/Gear/Gear1.mtl", (materials) => {
                if (!objLoader) return
                materials.preload()
                objLoader.setMaterials(materials)
                objLoader.load("../assets/Gear/Gear1.obj", (object) => {
                    if (!scene) return
                    scene.add(object)
                    mesh = object
                })
            })
        }
        //LoaderObjMtl()
        
        const uploadGltfButton = document.getElementById("3D-file-upload")
        if (uploadGltfButton){
            uploadGltfButton.addEventListener('click', async () => {
                if (!scene) return
                const objectUploaded = await upload3DFile() as any
                let meshUploaded = objectUploaded.mesh
                scene.add(meshUploaded)
                mesh?.add(meshUploaded)
            })
        }

        const bomarzoButton = document.getElementById("3D-file-upload-bomarzo")
        if (bomarzoButton){
            bomarzoButton.addEventListener('click', async () => {
                if (!scene) return
                const objectUploaded = await upload3DFile() as any
                let meshUploaded = objectUploaded.mesh
                //meshUploaded.position.set(-34.387421,-100.327,-130.047) //drago XYZ
                meshUploaded.rotation.set(Math.PI / 2, Math.PI, 0)
                scene.add(meshUploaded)
                mesh?.add(meshUploaded)
            })
        }
    }

    React.useEffect(() => {
        setViewer()
        return () => {
            mesh?.removeFromParent()
            mesh?.traverse((child) => {
                if (child instanceof THREE.Mesh){
                    child.geometry.dispose()
                    child.material.dispose()
                }
            })
            mesh = null
        }
    }, [])

    return(
        <div
        id="viewer-container"
        className="single-project-page-spaces viewer-container"
        style={{ backgroundColor: "transparent", width: "100%", margin: 0 }}
    />
    )
}