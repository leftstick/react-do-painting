import React from 'react'
import classnames from 'classnames'

import { IText } from '@/ReactPaintingBoard/IType'
import { id } from '@/ReactPaintingBoard/helper'

import styles from './index.less'

interface ITextProps {
  text: IText
  drawing: boolean
  onDoubleClick: (e: React.MouseEvent<SVGTextElement, MouseEvent>) => void
  onClick: (e: React.MouseEvent<SVGTextElement, MouseEvent>) => void
}

export default function SvgText({ drawing, text, onClick, onDoubleClick }: ITextProps) {
  const lines = text.words.split('\n')

  return (
    <text
      id={text.id}
      x={text.x}
      y={text.y}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      style={{
        fontSize: text.lineWidth,
        fill: text.lineColor,
      }}
      className={classnames({ [styles.textHover]: !drawing })}
    >
      {lines.map((line, index) => {
        return (
          <tspan key={id()} x={text.x} y={text.y + index * text.lineWidth} style={{ userSelect: 'none' }}>
            {line}
          </tspan>
        )
      })}
    </text>
  )
}
