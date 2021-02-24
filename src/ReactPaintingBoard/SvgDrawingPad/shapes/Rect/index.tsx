import React from 'react'
import classnames from 'classnames'

import { IRect } from '@/ReactPaintingBoard/IType'

import styles from './index.less'

interface IRectProps {
  rect: IRect
  drawing: boolean
  onClick: (e: React.MouseEvent<SVGRectElement, MouseEvent>) => void
}

export default function Rect({ drawing, rect, onClick }: IRectProps) {
  return (
    <rect
      onClick={onClick}
      id={rect.id}
      x={rect.x}
      y={rect.y}
      width={rect.width}
      height={rect.height}
      style={{
        fill: 'none',
        stroke: rect.lineColor,
        strokeWidth: rect.lineWidth,
      }}
      className={classnames({ [styles.rectHover]: !drawing })}
    />
  )
}
