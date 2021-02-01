import React from 'react'

interface IDividerProps {
  length: number
}

export default function Divider({ length }: IDividerProps) {
  return (
    <div
      style={{
        marginLeft: 5,
        marginRight: 5,
        borderLeft: '1px solid #dcdcdc',
        height: length,
        width: 1,
        display: 'inline-block',
      }}
    />
  )
}
