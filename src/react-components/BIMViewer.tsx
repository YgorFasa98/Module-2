import * as React from 'react'
import * as THREE from 'three'
import * as OBC from '@thatopen/components'
import * as BUI from '@thatopen/ui'
import * as CUI from '@thatopen/ui-obc'

import { ProjectsManager } from '../classes/ProjectsManager'

interface Props {
    projectsManager: ProjectsManager
}

export function BIMViewer (props:Props) {

    const components = new OBC.Components()
    
    const setViewer = () => {
        const worlds = components.get(OBC.Worlds)

        const world = worlds.create<
            OBC.SimpleScene,
            OBC.OrthoPerspectiveCamera,
            OBC.SimpleRenderer
        >()

        const sceneComponent = new OBC.SimpleScene(components)
        world.scene = sceneComponent
        world.scene.setup()

        const viewerContainer = document.getElementById('viewer-container') as HTMLElement
        const rendererComponent = new OBC.SimpleRenderer(components, viewerContainer)
        world.renderer = rendererComponent

        const cameraComponent = new OBC.OrthoPerspectiveCamera(components)
        world.camera = cameraComponent

        components.init()

        cameraComponent.controls.setLookAt(30,30,30, 0,0,0)
        cameraComponent.updateAspect()

        const ifcLoader = components.get(OBC.IfcLoader)
        ifcLoader.setup()

        const fragmentsManager = components.get(OBC.FragmentsManager)
        fragmentsManager.onFragmentsLoaded.add((model) => {
            world.scene.three.add(model)
        })

        viewerContainer.addEventListener("resize", () => {
            rendererComponent.resize()
            cameraComponent.updateAspect()
        })
    }

    const setupUI = () => {
        const viewerContainer = document.getElementById('viewer-container') as HTMLElement
        if (!viewerContainer) return

        const toolbar = BUI.Component.create<BUI.Toolbar>(() => {
            const [loadIfcButton] = CUI.buttons.loadIfc({components : components})
            return BUI.html`
            <bim-toolbar style="justify-self: center">
                <bim-toolbar-section>
                    ${loadIfcButton}
                </bim-toolbar-section>
            </bim-toolbar>
            `;
        })

        const floatingGrid = BUI.Component.create<BUI.Grid>(() => {
            return BUI.html`
                <bim-grid
                floating
                style="padding: 20px">
                </bim-grid>
            `;
        })

        floatingGrid.layouts = {
            main: {
                template: `
                    "empty" 1fr
                    "toolbar" auto
                    /1fr
                `,
                elements: {
                    toolbar
                }
            }
        }
        floatingGrid.layout = "main"

        viewerContainer.appendChild(floatingGrid)
    }

    React.useEffect(() => {
        setViewer()
        setupUI()
        return () => {
            components.dispose()
        }
    }, [])

    return(
        <bim-viewport
        id="viewer-container"
        className="single-project-page-spaces viewer-container"
        style={{ width: "100%", margin: 0 }}
        />
    )
}