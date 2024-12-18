import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

//Modal class
export class toggleModal{
    m
    //constructor
    constructor (id: string){
        this.m = document.getElementById(id)
    }
    //method to show modal
    showModal (){
        if (this.m && this.m instanceof HTMLDialogElement) {
            this.m.showModal()     
        } else {
            console.warn('New user modal was not found')
        }
    }
    //method to close modal
    closeModal (){
        if (this.m && this.m instanceof HTMLDialogElement) {
            this.m.close()
        } else {
            console.warn('New user modal was not found')
        }
    }
    preventEsc(){
        this.m.addEventListener('keydown', (e) => {
            if (e.key ==='Escape'){
                e.preventDefault()
            }
        })
    }
}

export function exportToJSON (list, fileName: string = 'downloaded_list.json') {
    const json = JSON.stringify(list, null, 2)
    const blob = new Blob([json], {type: 'application/json'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.click()
    URL.revokeObjectURL(url)
}

export function exportToCSV (list, fileName: string = 'downloaded_list.csv') {
    const csv = list.csv
    const blob = new Blob([csv], {type: 'text/csv'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.click()
    URL.revokeObjectURL(url)
}

export function calculateMeanAge(birthdays:Date[]) {
    const today = new Date();
    const ages = birthdays.map(birthdate => {
      const birth = birthdate;
      let age = today.getFullYear() - birth.getFullYear();
      // Adjust if birthday hasn’t occurred this year yet
      const monthDiff = today.getMonth() - birth.getMonth();
      const dayDiff = today.getDate() - birth.getDate();
      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
      }
      return age;
    });
    const meanAge = Math.round(ages.reduce((acc, age) => acc + age, 0) / ages.length * 100) / 100
    return meanAge;
  }
  
  export function upload3DFile() {
    return new Promise((resolve) => {
        let mesh
        let fileName: string
        const input = document.createElement('input') //create an html element tag <input>
        input.type = 'file' //opens a window to select files from PC
        input.accept = '.gltf,.obj' //accept only .obj and .gltf files
        const reader = new FileReader()
        input.click()
        input.addEventListener('change', () => {
            const fileList = input.files
            if (!fileList) {return}
            reader.readAsText(fileList[0])
            fileName = fileList[0].name
        })
        reader.addEventListener('load', () => {
            const importedFile = reader.result
            if (!importedFile) {return}
            if (fileName.split('.').pop()=='gltf'){ //gltf file
                const gltfLoader = new GLTFLoader()
                mesh = gltfLoader.parse(importedFile as string,'',(mesh)=>{
                    resolve({mesh:mesh.scene, fileName:fileName})
                })
            }else if (fileName.split('.').pop()=='obj'){ //obj file (only geometry not materials)
                const objLoader = new OBJLoader()
                mesh = objLoader.parse(importedFile as string)
                resolve({mesh:mesh, fileName:fileName})
            }
        })
    })
}