import * as React from 'react'

interface Props {
    onChange: (value:string) => void
    searchBy: string
}

export function SearchBar (props:Props) {
    return(
        <textarea
        onChange={(e) => {props.onChange(e.target.value)}}
        style={{ margin: 0 }}
        maxLength={20}
        className="search-bar"
        cols={40}
        rows={1}
        placeholder={`Search by ${props.searchBy}`}
        defaultValue={""}
      />
    )
}