import React from 'react'
import classnames from 'classnames'

import { IEllipse, IPoint, IDrawingTool } from '@/ReactDoPainting/IType'
import { id } from '@/ReactDoPainting/helper'

import styles from './index.less'

interface IEllipseProps {
  ellipse: IEllipse
  drawing: boolean
  onClick: (e: React.MouseEvent<SVGEllipseElement, MouseEvent>) => void
}

export function Ellipse({ drawing, ellipse, onClick }: IEllipseProps) {
  return (
    <ellipse
      onClick={onClick}
      id={ellipse.id}
      cx={ellipse.cx}
      cy={ellipse.cy}
      rx={ellipse.rx}
      ry={ellipse.ry}
      style={{
        fill: 'none',
        stroke: ellipse.lineColor,
        strokeWidth: ellipse.lineWidth,
      }}
      className={classnames({ [styles.ellipseHover]: !drawing })}
    />
  )
}

export function createEllipse(point: IPoint, workingDrawTool: IDrawingTool): IEllipse {
  return {
    id: id(),
    lineColor: workingDrawTool.drawColor,
    lineWidth: workingDrawTool.drawWidth,
    type: 'circle',
    cx: point.x,
    cy: point.y,
    rx: 1,
    ry: 1,
  }
}

export function drawEllipse(ellipse: IEllipse, point: IPoint): IEllipse | null {
  const rx = point.x - ellipse.cx
  const ry = point.y - ellipse.cy

  if (rx < 1 || ry < 1) {
    return null
  }

  return {
    ...ellipse,
    rx,
    ry,
  }
}
