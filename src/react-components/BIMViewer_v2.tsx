import * as React from 'react'
import * as OBC from '@thatopen/components'
import * as OBCF from '@thatopen/components-front'
import * as BUI from '@thatopen/ui'
import * as CUI from '@thatopen/ui-obc'
import * as FR from '@thatopen/fragments'

export function BIMViewer_v2 () {

    //ALL THE COMPONENTS
    const components = new OBC.Components()
    let globalScene: OBC.SimpleScene | undefined
    let globalWorld: OBC.World | undefined
    let fragmentsModel: FR.FragmentsGroup | undefined

    const [classificationsTree, updateClassificationsTree] = 
        CUI.tables.classificationTree({
            components,
            classifications: []
    })
   
    const processModel = async (model:FR.FragmentsGroup) => {
        const indexer = components.get(OBC.IfcRelationsIndexer)
        await indexer.process(model)
        
        const classifier = components.get(OBC.Classifier)
        classifier.byEntity(model)
        await classifier.byPredefinedType(model)
        await classifier.bySpatialStructure(model)
        const classifications = [
            { system: "entities", label: "Entities" },
            { system: "predefinedTypes", label: "Predefined Types" },
            { system: "spatialStructures", label: "Spatial Containers" }
        ]
        updateClassificationsTree({ classifications: classifications })
    }

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
        
        world.renderer.postproduction.enabled = true
        //GRID BACKGROUND
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

            if (model.hasProperties) {
                await processModel(model)
            }

            fragmentsModel = model
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

    //METHOD TO SETUP THE UI OF LOAD IFC BUTTON
    const setupUI = () => {
        const viewerContainer = document.getElementById('viewer-container') as HTMLElement
        if (!viewerContainer) return
        
        //FLOATING GRID TO HOST THE TOOLBAR
        const floatingGrid = BUI.Component.create<BUI.Grid>(() => {
            return BUI.html`
                <bim-grid
                floating
                style="padding: 20px">
                </bim-grid>
            `;
        })

        const BIMPanel = BUI.Component.create<BUI.Panel>(() => {
            return BUI.html`
                <bim-panel
                name="bim-panel"
                label="BIM Panel"
                >
                    <bim-panel-section
                        name="classifications"
                        label="Classifications Tree"
                        icon="carbon:classification"
                    >
                        ${classificationsTree}
                    </bim-panel-section>
                </bim-panel>
            `
        })
        const BIMPanel_2 = BUI.Component.create<BUI.Panel>(() => {
            return BUI.html`
                ${classificationsTree}
            `
        })

        const onOpenPanel = () => {
            if (!floatingGrid) return
            floatingGrid.layout = 'first'
        }
        const onOpenPanel_2 = () => {
            if (!floatingGrid) return
            floatingGrid.layout = 'second'
        }
        const onClosePanel = () => {
            if (!floatingGrid) return
            floatingGrid.layout = 'main'
        }

        //TOOLBAR COMPONENT
        const toolbar = BUI.Component.create<BUI.Toolbar>(() => {
            const [loadIfcButton] = CUI.buttons.loadIfc({components : components})
            loadIfcButton.label = 'IFC'
            return BUI.html`
            <bim-toolbar style="justify-self: center">
                <bim-toolbar-section label="Import">
                    ${loadIfcButton}
                </bim-toolbar-section>
                <bim-toolbar-section label="BIM Panel">
                    <bim-button
                        label="Open"
                        icon="fluent:open-32-filled"
                        @click=${onOpenPanel}
                    ></bim-button>
                    <bim-button
                        label="Open_2"
                        icon="fluent:open-32-filled"
                        @click=${onOpenPanel_2}
                    ></bim-button>
                    <bim-button
                        label="Close"
                        icon="gg:close-r"
                        @click=${onClosePanel}
                    ></bim-button>
                </bim-toolbar-section>
            </bim-toolbar>
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
            },
            first: {
                template: `
                    "empty BIMPanel" 1fr
                    "toolbar toolbar" auto
                    /1fr 20rem
                `,
                elements: {
                    toolbar,
                    BIMPanel
                }
            },
            second: {
                template: `
                    "empty BIMPanel_2" 1fr
                    "toolbar toolbar" auto
                    /1fr 20rem
                `,
                elements: {
                    toolbar,
                    BIMPanel_2
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