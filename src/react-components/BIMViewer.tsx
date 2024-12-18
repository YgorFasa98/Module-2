import * as React from 'react'
import * as OBC from '@thatopen/components'
import * as OBCF from '@thatopen/components-front'
import * as BUI from '@thatopen/ui'
import * as CUI from '@thatopen/ui-obc'
import * as FR from '@thatopen/fragments'

import { ProjectsManager } from '../classes/ProjectsManager'
import { upload3DFile } from '../classes/Generic'

interface Props {
    projectsManager: ProjectsManager
}

export function BIMViewer (props:Props) {

    //ALL THE COMPONENTS
    const components = new OBC.Components()
    let globalScene: OBC.SimpleScene | undefined
    let globalWorld: OBC.World | undefined
    
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
        fragmentsManager.onFragmentsLoaded.add(async (model) => {
            world.scene.three.add(model)

            const indexer = components.get(OBC.IfcRelationsIndexer)
            await indexer.process(model)
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

        
        globalScene = world.scene
        globalWorld = world
    }

    const onToggleVisibility = () => {
        const highlighter = components.get(OBCF.Highlighter)
        const selection = highlighter.selection.select
        const hider = components.get(OBC.Hider)
        const fragments = components.get(OBC.FragmentsManager)
        const OneOfSelectedFragments = fragments.list.get(Object.keys(selection)[0])
        if (!OneOfSelectedFragments) return
        if (OneOfSelectedFragments.hiddenItems.size === 0) {
            hider.set(false, selection)
        } else {
            hider.set(true, selection)
        }
    }

    const onInvertVisibility = () => {
        const fragments = components.get(OBC.FragmentsManager)
        const hider = components.get(OBC.Hider)
        const fragmentIdMap : FR.FragmentIdMap = {}
        for (const [key, fragment] of fragments.list) {
            if (!fragment) continue
            if (fragment.hiddenItems.size === 0) continue
            fragmentIdMap[key] = fragment.hiddenItems
        }
        hider.isolate(fragmentIdMap)
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

    /*const onUpload3DFile = async () => {        
        const worlds = components.get(OBC.Worlds)
        const [worldId] = worlds.list
        const world = worldId[1]
        const object = await upload3DFile() as any
        let meshUploaded = object.mesh
        if (world) {
            world?.scene.three.add(meshUploaded)
            world?.meshes.add(meshUploaded)
        } else {
            console.warn('world not found')
        }
    }*/

    const onUpload3DFile = async () => {
        if (!globalScene || !globalWorld) return
        const object = await upload3DFile() as any
        let meshUploaded = object.mesh
        globalScene.three.add(meshUploaded)
        globalWorld.meshes.add(meshUploaded)
    }

    const onShowProperties = () => {
        const highlighter = components.get(OBCF.Highlighter)
        const selection = highlighter.selection.select
        const indexer = components.get(OBC.IfcRelationsIndexer)
        const fragments = components.get(OBC.FragmentsManager)
        for (const fragmentID in selection) {
            const fragment = fragments.list.get(fragmentID)
            const model = fragment?.group
            const expressIDs = selection[fragmentID]
            if (!model) continue
            for (const id of expressIDs) {
                const pset = indexer.getEntityRelations(model, id, 'IsDefinedBy')
                console.log(pset)
            }
        }
    }

    //METHOD TO SETUP THE UI OF LOAD IFC BUTTON
    const setupUI = () => {
        const viewerContainer = document.getElementById('viewer-container') as HTMLElement
        if (!viewerContainer) return
        //TOOLBAR COMPONENT WITH LOAD BUTTON
        const toolbar = BUI.Component.create<BUI.Toolbar>(() => {
            const [loadIfcButton] = CUI.buttons.loadIfc({components : components})
            loadIfcButton.label = 'IFC'
            return BUI.html`
            <bim-toolbar style="justify-self: center">
                <bim-toolbar-section label="Import">
                    ${loadIfcButton}
                    <bim-button
                        label="GLTF/OBJ"
                        icon="uis:object-group"
                        @click=${onUpload3DFile}
                    ></bim-button>
                </bim-toolbar-section>
                <bim-toolbar-section label="Visibility">
                    <bim-button
                        label="Hide/Show"
                        icon="material-symbols:visibility-outline"
                        @click=${onToggleVisibility}
                    ></bim-button>
                    <bim-button
                        label="Isolate"
                        icon="mdi:filter"
                        @click=${onIsolate}
                    ></bim-button>
                    <bim-button
                        label="Invert"
                        icon="icon-park-outline:invert-camera"
                        @click=${onInvertVisibility}
                    ></bim-button>
                    <bim-button
                        label="Show All"
                        icon="tabler:eye-filled"
                        @click=${onShowAll}
                    ></bim-button>
                </bim-toolbar-section>
                <bim-toolbar-section label="Property">
                    <bim-button
                        label="Show"
                        icon="clarity:list-line"
                        @click=${onShowProperties}
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
            if (components) {
                components.dispose()
            }
            if (globalWorld) {
                globalWorld.dispose()
                globalWorld = undefined
            }
            if (globalScene) {
                globalScene.dispose()
                globalScene = undefined
            }
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