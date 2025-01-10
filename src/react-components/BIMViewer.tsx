import * as React from 'react'
import * as OBC from '@thatopen/components'
import * as OBCF from '@thatopen/components-front'
import * as BUI from '@thatopen/ui'
import * as CUI from '@thatopen/ui-obc'
import * as FR from '@thatopen/fragments'

import { upload3DFile } from '../classes/Generic'

export function BIMViewer () {

    //COMPONENTS and GLOBAL VARIABLES
    const components = new OBC.Components()
    let globalScene: OBC.SimpleScene | undefined
    let globalWorld: OBC.World | undefined
    let globalCuller: OBC.MeshCullerRenderer | undefined
    let fragmentsModel: FR.FragmentsGroup | undefined

    /*const [classificationsTree, updateClassificationsTree] = 
        CUI.tables.classificationTree({
            components,
            classifications: []
    })*/

    const processModel = async (model:FR.FragmentsGroup) => {
        const indexer = components.get(OBC.IfcRelationsIndexer)
        await indexer.process(model)
        
        /*const classifier = components.get(OBC.Classifier)
        classifier.byEntity(model)
        await classifier.byPredefinedType(model)
        await classifier.bySpatialStructure(model)
        const classifications = [
            { system: "entities", label: "Entities" },
            { system: "predefinedTypes", label: "Predefined Types" },
            { system: "spatialStructures", label: "Spatial Containers" }
        ]
        updateClassificationsTree({ classifications: classifications })*/
    }
    const onFragmentsDispose = () => {
        const fragmentsManager = components.get(OBC.FragmentsManager)
        for (const [, group] of fragmentsManager.groups){
            fragmentsManager.disposeGroup(group)
        }
        fragmentsModel = undefined
    }

    // METHOD TO CREATE AND SET THE VIEWER
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
        //CULLING
        const cullers = components.get(OBC.Cullers)
        const culler = cullers.create(world)
        world.camera.controls.addEventListener('controlend', () => {
            culler.needsUpdate = true
        })
        //FRAGMENTS TO MANAGE IFC FILES
        const fragmentsManager = components.get(OBC.FragmentsManager)
        fragmentsManager.onFragmentsLoaded.add(async (model) => {
            world.scene.three.add(model)

            if (model.hasProperties) {
                await processModel(model)
            }

            for (const fragment of model.items) {
                culler.add(fragment.mesh)
            }
            culler.needsUpdate = true

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
        globalCuller = culler
    }

    //EVENTS
    //Visibility
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
    //Culler
    const onNotUseCuller = () => {
        if (!globalCuller) return
        globalCuller.enabled = false
        // this is used to make visible the hidden meshes by the culler until then
        if (!fragmentsModel) return
        for (const fragment of fragmentsModel.items) {
            fragment.mesh.visible = true
        }
    }
    const onUseCuller = () => {
        if (!globalCuller) return
        globalCuller.enabled = true
    }

    //TESTS
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
                // 'Decomposes' inverse of IfcRelAggregates
                // 'IsDefinedBy' is for Psets
                const relation = 'Decomposes'
                const rels = indexer.getEntityRelations(model, id, relation)
                if(rels){
                    for (const expressID of rels) {
                        const prop = await model.getProperties(expressID)
                        console.log('These properties comes from the inverse relation: ', relation)
                        console.log(prop)
                    }
                }
            }
        }
    }

    //METHOD TO SETUP THE UI OF THE VIEWER
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

        //BIM PANEL ELEMENTS
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

            const fragmentsManager = components.get(OBC.FragmentsManager)
            fragmentsManager.onFragmentsLoaded.add(async (model) => {
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
                        name="spatialStructure"
                        label="Spatial Structure"
                        icon="ri:node-tree"
                    >
                        ${spatialStructureTable}
                    </bim-panel-section>
                    <bim-panel-section
                        name="classifications"
                        label="Classifications Tree"
                        icon="carbon:classification"
                    >
                        ${classificationsTree}
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
            if ( floatingGrid.layout !== "third"){
                floatingGrid.layout = 'third'
            } else if ( floatingGrid.layout == "third") {
                floatingGrid.layout = 'main'
            }
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

        //EXPORT AND IMPORT FRAGMENTS AND PROPERTIES
        const onFragmentsExport = () => {
            const fragmentsManager = components.get(OBC.FragmentsManager)
            console.log(fragmentsManager.groups)
            if (!fragmentsManager.groups.size) return
            for (const m of fragmentsManager.groups.values()) {
                const fragmentBinary = fragmentsManager.export(m)
                const blob = new Blob([fragmentBinary])
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `${m.name}.frag`
                a.click()
                URL.revokeObjectURL(url)
                onPropertyExport(m)
            }
        }
        const onFragmentsImport = async () => {
            const input = document.createElement('input')
            input.type = 'file'
            input.multiple = true
            input.accept = '.frag, .json'            

            const models: {[file: string]: FR.FragmentsGroup} = {}
            const properties: {[file: string]: FR.IfcProperties} = {}

            input.addEventListener('change', async () => {
                const fileList = input.files
                if (!fileList) {return}

                //read files
                const fragmentsManager = components.get(OBC.FragmentsManager)
                for (const file of fileList) {
                    const split = file.name.split('.')
                    if (split[split.length-1] == 'frag'){
                        const binary = await file.arrayBuffer()
                        models[split[0]] = fragmentsManager.load(new Uint8Array(binary)) //import geometries here
                    } else if (split[split.length-1] == 'json') {
                        const json = await file.text()
                        properties[split[0].replace('_properties','')] = JSON.parse(json as string)
                    }
                }

                //associate model-property
                if (Object.keys(models).length != 0){
                    for (const name in properties) {
                        models[name].setLocalProperties(properties[name])
                        await processModel(models[name])
                    }
                } else if (Object.keys(models).length == 0) {
                    for (const name in properties) {
                        for (const m of fragmentsManager.groups.values()) {
                            if (name == m.name) {
                                m.setLocalProperties(properties[name])
                                await processModel(m)
                            }
                        }
                    }
                }
            })
            input.click()
        }

        const onPropertyExport = (m: FR.FragmentsGroup) => {
            if (!m) return
            const properties = m.getLocalProperties()
            const json = JSON.stringify(properties)
            const blob = new Blob([json], {type: 'application/json'})
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${m.name}_properties.json`
            a.click()
            URL.revokeObjectURL(url)
        }

        //TOOLBAR COMPONENT
        const toolbar = BUI.Component.create<BUI.Toolbar>(() => {
            const [loadIfcButton] = CUI.buttons.loadIfc({components : components})
            loadIfcButton.label = 'IFC'
            return BUI.html`
            <bim-toolbar style="justify-self: center">
                <bim-toolbar-section label="Viewer">
                    <bim-button
                        tooltip-title="Settings"
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
                <bim-toolbar-section label="Fragments">
                    <bim-button
                        tooltip-title="Import"
                        icon="lucide:upload"
                        @click=${onFragmentsImport}
                    ></bim-button>
                    <bim-button
                        tooltip-title="Export"
                        icon="lucide:download"
                        @click=${onFragmentsExport}
                    ></bim-button>
                    <bim-button
                        tooltip-title="Dispose all models"
                        icon="tabler:trash"
                        @click=${onFragmentsDispose}
                    ></bim-button>
                </bim-toolbar-section>
                <bim-toolbar-section label="Visibility">
                    <bim-button
                        tooltip-title="Hide/Show"
                        icon="material-symbols:visibility-outline"
                        @click=${onToggleVisibility}
                    ></bim-button>
                    <bim-button
                        tooltip-title="Isolate"
                        icon="mdi:filter"
                        @click=${onIsolate}
                    ></bim-button>
                    <bim-button
                        tooltip-title="Invert"
                        icon="icon-park-outline:invert-camera"
                        @click=${onInvertVisibility}
                    ></bim-button>
                    <bim-button
                        tooltip-title="Show All"
                        icon="tabler:eye-filled"
                        @click=${onShowAll}
                    ></bim-button>
                </bim-toolbar-section>
                <bim-toolbar-section label="Culler">
                    <bim-button
                        tooltip-title="Enable culler"
                        icon="mdi:set-right"
                        @click=${onUseCuller}
                    ></bim-button>
                    <bim-button
                        tooltip-title="Disable culler"
                        icon="mdi:set-all"
                        @click=${onNotUseCuller}
                    ></bim-button>
                </bim-toolbar-section>
                <bim-toolbar-section label="BIM Panel">
                    <bim-button
                        tooltip-title="Open"
                        icon="fluent:open-32-filled"
                        @click=${onOpenPanel}
                    ></bim-button>
                    <bim-button
                        tooltip-title="Close"
                        icon="gg:close-r"
                        @click=${onClosePanel}
                    ></bim-button>
                </bim-toolbar-section>
                    <bim-toolbar-section label="TESTS">
                    <bim-button
                        label="Print Properties"
                        icon="ri:question-line"
                        @click=${onShowProperties}
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
            //onFragmentsDispose()
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