import React from 'react'
import classnames from 'classnames'

import { ILine, IPoint, IDrawingTool } from '@/ReactPaintingBoard/IType'
import { id } from '@/ReactPaintingBoard/helper'

import styles from './index.less'

interface ILineProps {
  line: ILine
  drawing: boolean
  onClick: (e: React.MouseEvent<SVGPathElement, MouseEvent>) => void
}

export function Line({ drawing, line, onClick }: ILineProps) {
  const pathData =
    'M ' +
    line.points
      .map((p) => {
        return `${p.x} ${p.y}`
      })
      .join(' L ')

  return (
    <path
      onClick={onClick}
      id={line.id}
      className={classnames(styles.path, { [styles.lineHover]: !drawing })}
      d={pathData}
      stroke={line.lineColor}
      strokeWidth={line.lineWidth}
    />
  )
}

export function createLine(point: IPoint, workingDrawTool: IDrawingTool): ILine {
  return {
    id: id(),
    lineColor: workingDrawTool.drawColor,
    lineWidth: workingDrawTool.drawWidth,
    type: 'line',
    points: [point],
  }
}

export function drawLine(line: ILine, point: IPoint): ILine {
  return {
    ...line,
    points: [...line.points, point],
  }
}
