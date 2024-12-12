import * as React from 'react'
import * as THREE from 'three'
import * as OBC from '@thatopen/components'

import { ProjectsManager } from '../classes/ProjectsManager'

interface Props {
    projectsManager: ProjectsManager
}

export function BIMViewer (props:Props) {
    
    const setViewer = () => {
        const viewer = new OBC.Components()
        const worlds = viewer.get(OBC.Worlds)

        const world = worlds.create<
            OBC.SimpleScene,
            OBC.OrthoPerspectiveCamera,
            OBC.SimpleRenderer
        >()

        const sceneComponent = new OBC.SimpleScene(viewer)
        world.scene = sceneComponent
        world.scene.setup()
        world.scene.three.background = null

        const viewerContainer = document.getElementById('viewer-container') as HTMLElement
        const rendererComponent = new OBC.SimpleRenderer(viewer, viewerContainer)
        world.renderer = rendererComponent

        const cameraComponent = new OBC.OrthoPerspectiveCamera(viewer)
        world.camera = cameraComponent

        viewer.init()

        const material = new THREE.MeshLambertMaterial({color: 'yellow'})
        const geometry = new THREE.BoxGeometry()
        const cube = new THREE.Mesh(geometry, material)

        world.scene.three.add(cube)

        cameraComponent.controls.setLookAt(3,3,3, 0,0,0)
        cameraComponent.updateAspect()
    }

    React.useEffect(() => {
        setViewer()
        return () => {

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