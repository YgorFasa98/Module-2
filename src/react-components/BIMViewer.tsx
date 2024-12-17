import * as React from 'react'
import * as THREE from 'three'
import * as OBC from '@thatopen/components'
import * as OBCF from '@thatopen/components-front'
import * as BUI from '@thatopen/ui'
import * as CUI from '@thatopen/ui-obc'

import { ProjectsManager } from '../classes/ProjectsManager'

interface Props {
    projectsManager: ProjectsManager
}

export function BIMViewer (props:Props) {

    //ALL THE COMPONENTS
    const components = new OBC.Components()
    
    const setViewer = () => {
        //THE VIEWERS COMPONENT
        const worlds = components.get(OBC.Worlds)
        //THE SINGLE VIEWER
        const world = worlds.create<
            OBC.SimpleScene,
            OBC.OrthoPerspectiveCamera,
            OBCF.PostproductionRenderer
        >()
        //SCENE
        const sceneComponent = new OBC.SimpleScene(components)
        world.scene = sceneComponent
        world.scene.three.background = null
        world.scene.setup()
        //RENDERER
        const viewerContainer = document.getElementById('viewer-container') as HTMLElement
        const rendererComponent = new OBCF.PostproductionRenderer(components, viewerContainer)
        world.renderer = rendererComponent
        //CAMERA
        const cameraComponent = new OBC.OrthoPerspectiveCamera(components)
        world.camera = cameraComponent
        //INITIALIZE ALL THE COMPONENTS
        components.init()
        //GRID BACKGROUND
        const grids = components.get(OBC.Grids);
        const grid = grids.create(world);
        grids.config.color.set('darkgray');
        //CAMERA LOOK AT TARGET
        cameraComponent.controls.setLookAt(30,30,30, 0,0,0)
        cameraComponent.updateAspect()
        //IFC LOADER
        const ifcLoader = components.get(OBC.IfcLoader)
        ifcLoader.setup()
        //FRAGMENTS TO MANAGE IFC FILES
        const fragmentsManager = components.get(OBC.FragmentsManager)
        fragmentsManager.onFragmentsLoaded.add((model) => {
            world.scene.three.add(model)
        })
        //AUTOMATIC RESIZE VIEWER
        viewerContainer.addEventListener("resize", () => {
            rendererComponent.resize()
            cameraComponent.updateAspect()
        })
        //HIGHLIGHTER OF SELECTED ELEMENTS
        const highlighter = components.get(OBCF.Highlighter)
        highlighter.setup({ world })
        highlighter.zoomToSelection = true
    }

    /*const onToggleVisibility = () => {
        const highlighter = components.get(OBCF.Highlighter)
        const fragments = components.get(OBC.FragmentsManager)
        const selection = highlighter.selection.select
        if (Object.keys(selection).length === 0) return
        for (const fragmentID in selection) {
            const fragment = fragments.list.get(fragmentID)
            const expressID = selection[fragmentID]
            for (const id of expressID){
                if (!fragment) continue
                const isHidden = fragment.hiddenItems.has(id)
                if (isHidden) {
                    fragment.setVisibility(true, [id])
                } else {
                    fragment.setVisibility(false, [id])
                }
            }
        }
    }
    const onInvertVisibility = () => {
        const highlighter = components.get(OBCF.Highlighter)
        const fragments = components.get(OBC.FragmentsManager)
        const hider = components.get(OBC.Hider)
        for (const [key, fragment] of fragments.list) {
            if (!fragment) continue
            hider.set(true, fragment.hiddenItems.has(fragment.ids))
        }
    }*/

    let visibility = true
    const onToggleVisibility = () => {
        const highlighter = components.get(OBCF.Highlighter)
        const selection = highlighter.selection.select
        const hider = components.get(OBC.Hider)
        if (visibility) {
            hider.set(false, selection)
            visibility = false
        } else {
            hider.set(true, selection)
            visibility = true
        }
    }

    const onIsolate = () => {
        const highlighter = components.get(OBCF.Highlighter)
        const hider = components.get(OBC.Hider)
        const selection = highlighter.selection.select
        hider.isolate(selection)
    }

    const onShowAll = () => {
        const hider = components.get(OBC.Hider)
        hider.set(true)
    }

    //METHOD TO SETUP THE UI OF LOAD IFC BUTTON
    const setupUI = () => {
        const viewerContainer = document.getElementById('viewer-container') as HTMLElement
        if (!viewerContainer) return
        //TOOLBAR COMPONENT WITH LOAD BUTTON
        const toolbar = BUI.Component.create<BUI.Toolbar>(() => {
            const [loadIfcButton] = CUI.buttons.loadIfc({components : components})
            return BUI.html`
            <bim-toolbar style="justify-self: center">
                <bim-toolbar-section label="Import">
                    ${loadIfcButton}
                </bim-toolbar-section>
                <bim-toolbar-section label="Selection">
                    <bim-button
                        label="Visibility"
                        icon="material-symbols:visibility-outline"
                        @click=${onToggleVisibility}
                    ></bim-button>
                    <bim-button
                        label="Isolate"
                        icon="mdi:filter"
                        @click=${onIsolate}
                    ></bim-button>
                    <bim-button
                        label="Show All"
                        icon="tabler:eye-filled"
                        @click=${onShowAll}
                    ></bim-button>
                </bim-toolbar-section>
            </bim-toolbar>
            `;
        })
        //FLOATING GRID TO HOST THE TOOLBAR
        const floatingGrid = BUI.Component.create<BUI.Grid>(() => {
            return BUI.html`
                <bim-grid
                floating
                style="padding: 20px">
                </bim-grid>
            `;
        })
        //GRID LAYOUT
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
        floatingGrid.layout = "main" //set active layout

        viewerContainer.appendChild(floatingGrid) //append grid to the viewer container
    }

    React.useEffect(() => {
        setViewer() //set the viewer
        setupUI() //set the toolbar ui
        return () => {
            components.dispose()
        }
    }, [])

    return( //return the whole BIM viewer component
        <bim-viewport
        id="viewer-container"
        className="single-project-page-spaces viewer-container"
        style={{ width: "100%", margin: 0 }}
        />
    )
}