import * as React from 'react'
import * as BUI from '@thatopen/ui'

interface Props {
    onChange: (value:string) => void
    searchBy: string
}

export function SearchBar (props:Props) {

    const searchInput = document.getElementById('search-input') as BUI.TextInput
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            props.onChange(searchInput.value)
        })
    }

    return(
        <bim-text-input
            id = 'search-input'
            style={{ 
                margin: 0,
                alignContent: 'center'                
            }}
            className="search-bar"
            placeholder={`Search by ${props.searchBy}`}
            defaultValue={""}
            icon='ion:search'>
        </bim-text-input>
    )
}