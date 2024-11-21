import * as React from 'react'
import * as BUI from '@thatopen/ui'
import { exportToCSV } from '../classes/Generic'

export function InfoPage () {
    //component per la tabella
    const userTable = BUI.Component.create<BUI.Table>(() => {
        const onTableCreated = (element?: Element) => { //evento quando viene creata la tabella
            const table = element as BUI.Table
            table.data = [ //contenuti della tabella
                {
                    data: {
                        Name: "Ygor Fasanella",
                        Email: "ygor.fasanella@studenti.unipd.it",
                        Role: "PhD student",
                        Birthday: "11-12-1998"
                    }
                },
                {
                    data: {
                        Name: "Alberto Rossi",
                        Email: "alberto.rossi@example.com",
                        Role: "Architect",
                        Birthday: "08-07-1986"
                    }
                }
            ]
        }
        // return del codice HTML dove il tag bim-table ha l'evento di creare la tabella come reference quindi non a seguito di interazioni con l'utente
        return BUI.html`
        <bim-table ${BUI.ref(onTableCreated)}></bim-table>
        `
    })

    // invece del contenitore div generico viene sostituito con questo component per inserire la tabella creata sopra, è chiamato panel e può essere diviso in sezioni
    const content = BUI.Component.create<BUI.Panel>(() => {
        return BUI.html`
        <bim-panel style="background-color:var(--backgroundColor)">
            <bim-panel-section label="Users">
                ${userTable}
            </bim-panel-section>
        </bim-panel>`
    })

    // sidebar component
    const sidebar = BUI.Component.create<BUI.Component>(() => {
        const buttonStyle = {
            "height": "50px",
            "margin": "5px",
        }
        //icons from iconify.com
        return BUI.html`
        <div style="padding: 4px">
            <bim-button
                icon="fluent:print-32-regular"
                style=${BUI.styleMap(buttonStyle)}
                @click=${() => {
                    console.log(userTable.data)
                }}
            ></bim-button>
            <bim-button
                icon="eva:download-fill"
                style=${BUI.styleMap(buttonStyle)}
                @click=${() => {
                    exportToCSV(userTable)
                }}
            ></bim-button>
        </div>
        `
    })

    const searchInTable = (table:BUI.Table) => {
        const inputBox = BUI.Component.create<BUI.TextInput>(() => {
            return BUI.html`
            <bim-text-input style="padding: 8px" placeholder="Search">
            </bim-text-input>
            `;
        })
        inputBox.addEventListener("input", () => {
            table.queryString = inputBox.value
        })
        return inputBox
    }

    const footer = BUI.Component.create<BUI.Component>(() => {
        return BUI.html`
        <div style="display:flex; justify-content:center">
            <bim-label>Copyright by Ygor Fasanella</bim-label>
        </div>
        `
    })

    const gridLayout: BUI.Layouts = {
        primary: { //nel template ci vanno assolutamente "" e non ''
            template:`
            "header header" 40px
            "content sidebar" 1fr
            "footer footer" 80px
            / 1fr 100px
            `,
            elements: {
                header: searchInTable(userTable),
                content, //questo elemento viene sostituito dal component sopra, perchè hanno lo stesso nome
                sidebar,
                footer,
            }
        }
    }

    //initialize web components
    React.useEffect(() => {
        const grid = document.getElementById('bimGrid') as BUI.Grid
        grid.layouts = gridLayout
        grid.layout = 'primary'
        grid.style.backgroundColor = 'var(--backgroundColor)'
    }, [])

    return(
        <div id='info-page' className='page'>
            <bim-grid id='bimGrid'></bim-grid>
        </div>
    )
}