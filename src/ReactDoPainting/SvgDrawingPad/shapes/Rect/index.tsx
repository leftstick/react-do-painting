import React from 'react'
import classnames from 'classnames'

import { IRect, IPoint, IDrawingTool } from '@/ReactDoPainting/IType'
import { id } from '@/ReactDoPainting/helper'

import styles from './index.less'

interface IRectProps {
  rect: IRect
  drawing: boolean
  onClick: (e: React.MouseEvent<SVGRectElement, MouseEvent>) => void
}

export function Rect({ drawing, rect, onClick }: IRectProps) {
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

export function createRect(point: IPoint, workingDrawTool: IDrawingTool): IRect {
  return {
    id: id(),
    lineColor: workingDrawTool.drawColor,
    lineWidth: workingDrawTool.drawWidth,
    type: 'rect',
    x: point.x,
    y: point.y,
    width: 1,
    height: 1,
  }
}

export function drawRect(rect: IRect, point: IPoint): IRect | null {
  const width = point.x - rect.x
  const height = point.y - rect.y

  if (width < 1 || height < 1) {
    return null
  }

  return {
    ...rect,
    width,
    height,
  }
}
