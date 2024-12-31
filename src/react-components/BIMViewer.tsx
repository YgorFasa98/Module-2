import * as React from 'react'
import * as OBC from '@thatopen/components'
import * as OBCF from '@thatopen/components-front'
import * as BUI from '@thatopen/ui'
import * as CUI from '@thatopen/ui-obc'
import * as FR from '@thatopen/fragments'

import { ProjectsManager } from '../classes/ProjectsManager'
import { upload3DFile } from '../classes/Generic'
import { classificationTreeTemplate } from '@thatopen/ui-obc/dist/components/tables/ClassificationsTree/src/template'
import { SpatialStructure } from '@thatopen/components/dist/fragments/IfcLoader/src'

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
        
        world.renderer.postproduction.enabled = true
        //GRID BACKGROUND
        const grids = components.get(OBC.Grids);
        const grid = grids.create(world);
        grid.config.color.set('#1C1C1C');
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

    const onShowProperties = async () => {
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
                const psets = indexer.getEntityRelations(model, id, 'IsDefinedBy')
                if(psets){
                    for (const expressID of psets) {
                        const prop = await model.getProperties(expressID)
                        console.log(prop)
                    }
                }
            }
        }
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

        const elementPropertyPanel = BUI.Component.create<BUI.Panel>(() => {
            const [propsTable, updatePropsTable] = CUI.tables.elementProperties({
                components,
                fragmentIdMap: {}
            })

            const highlighter = components.get(OBCF.Highlighter)

            highlighter.events.select.onHighlight.add((fragmentIdMap) => {
                //if (!floatingGrid) return
                //floatingGrid.layout = "second"
                updatePropsTable({ fragmentIdMap })
                propsTable.expanded = false
                onOpenPanel()
            }) // event to open the properties panel

            highlighter.events.select.onClear.add(() => {
                updatePropsTable({ fragmentIdMap: {} })
                //if (!floatingGrid) return
                //floatingGrid.layout = "main"
            }) // event to close the property panel and clear it

            const onSearch = (e: Event) => {
                const input = e.target as BUI.TextInput
                propsTable.queryString = input.value
            }

            return BUI.html`
                <bim-panel-section
                    name="property"
                    label="Property Information"
                    icon="hugeicons:property-new"
                >
                    <bim-text-input 
                        placeholder="Search..." 
                        @input=${onSearch}
                    >
                    </bim-text-input>
                    ${propsTable}
                </bim-panel-section>
            `
        })

        const BIMPanel = BUI.Component.create<BUI.Panel>(() => {
            const [spatialStructureTable] = CUI.tables.relationsTree({
                components,
                models: []
            })
            const [modelsList] = CUI.tables.modelsList({
                components,
                tags: { schema: true, viewDefinition: false },
                actions: { download: false }
            })    
            const [classificationsTree, updateClassificationsTree] = CUI.tables.classificationTree({
                components,
                classifications: []
            })

            const fragmentsManager = components.get(OBC.FragmentsManager);
            const classifier = components.get(OBC.Classifier)
            fragmentsManager.onFragmentsLoaded.add(async (model) => {
                classifier.byEntity(model)
                await classifier.byPredefinedType(model)
                const classifications = [
                    { system: "entities", label: "Entities" },
                    { system: "predefinedTypes", label: "Predefined Types" },
                ]
                console.log("pre update manager", classificationsTree)
                updateClassificationsTree({ classifications: classifications });
                console.log("post update manager", classificationsTree)
            })

            return BUI.html`
                <bim-panel
                id = 'bim-panel'
                name="bim-panel"
                label="BIM Panel"
                style = "background-color: transparent"
                >
                    <bim-panel-section
                        name="models"
                        label="Loaded Models"
                        icon="material-symbols:upload-rounded"
                    >
                        ${modelsList}
                    </bim-panel-section>
                    <bim-panel-section
                        name="classifications"
                        label="Classifications Tree"
                        icon="carbon:classification"
                    >
                        ${classificationsTree}
                    </bim-panel-section>
                    <bim-panel-section
                        name="spatialStructure"
                        label="Spatial Structure"
                        icon="ri:node-tree"
                    >
                        ${spatialStructureTable}
                    </bim-panel-section>
                    ${elementPropertyPanel}
                </bim-panel>
            `
        })

        const viewerSettingsPanel = BUI.Component.create<BUI.Panel>(() => {
            const [worldTable] = CUI.tables.worldsConfiguration({ components })
            
            const onSearch = (e: Event) => {
                const input = e.target as BUI.TextInput
                worldTable.queryString = input.value
            }

            return BUI.html`
                <bim-panel>
                    <bim-panel-section
                        name="viewer"
                        label="Viewer Settings"
                        icon="ic:baseline-settings"
                    >
                        <bim-text-input 
                            placeholder="Search..." 
                            @input=${onSearch}
                        >
                        </bim-text-input>
                        ${worldTable}
                    </bim-panel-section>
                </bim-panel>
            `
        })

        const onViewerSettingsButtonClick = () => {
            if (!floatingGrid) return           
            floatingGrid.layout = 'third'
        }

        const onOpenPanel = () => {
            const sxBar = document.getElementById('sx-bar')
            const projectDetails = document.getElementById('sx-bar-project-details')
            const todos = document.getElementById('sx-bar-todos')
            if (!projectDetails || !sxBar || !todos) return
            projectDetails.style.display = "none"
            todos.style.display = "none"
            sxBar.appendChild(BIMPanel)
            sxBar.style.backgroundColor = "var(--background)"
        }
        const onClosePanel = () => {
            const sxBar = document.getElementById('sx-bar')
            const projectDetails = document.getElementById('sx-bar-project-details')
            const todos = document.getElementById('sx-bar-todos')
            if (!projectDetails || !sxBar || !todos) return
            projectDetails.style.display = ""
            todos.style.display = ""
            sxBar.removeChild(BIMPanel)
            sxBar.style.backgroundColor = "transparent"
        }

        //TOOLBAR COMPONENT
        const toolbar = BUI.Component.create<BUI.Toolbar>(() => {
            const [loadIfcButton] = CUI.buttons.loadIfc({components : components})
            loadIfcButton.label = 'IFC'
            return BUI.html`
            <bim-toolbar style="justify-self: center">
                <bim-toolbar-section label="Viewer">
                    <bim-button
                        label="Settings"
                        icon="ic:baseline-settings"
                        @click=${onViewerSettingsButtonClick}
                    ></bim-button>
                </bim-toolbar-section>
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
                <bim-toolbar-section label="BIM Panel">
                    <bim-button
                        label="Open"
                        icon="fluent:open-32-filled"
                        @click=${onOpenPanel}
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
            second: {
                template: `
                    "empty elementPropertyPanel" 1fr
                    "toolbar toolbar" auto
                    /1fr 30rem
                `,
                elements: {
                    toolbar,
                    elementPropertyPanel
                }
            },
            third: {
                template: `
                    "empty viewerSettingsPanel" 1fr
                    "toolbar toolbar" auto
                    /1fr 30rem
                `,
                elements: {
                    toolbar,
                    viewerSettingsPanel
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