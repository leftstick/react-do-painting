import React from 'react'

import { IArrowLine, IPoint, IDrawingTool } from '@/ReactDoPainting/IType'
import { id, classnames } from '@/ReactDoPainting/helper'

import styles from './index.less'

interface IArrowLineMarkerProps {
  arrowLine: IArrowLine
}

interface IArrowLineProps {
  arrowLine: IArrowLine
  drawing: boolean
  onClick: (e: React.MouseEvent<SVGPathElement, MouseEvent>) => void
}

export function ArrowLineMarker({ arrowLine }: IArrowLineMarkerProps) {
  return (
    <marker
      id={`marker-${arrowLine.id}`}
      markerWidth={10}
      markerHeight={10}
      markerUnits="strokeWidth"
      refX="3"
      refY="4"
      orient="auto"
    >
      <path d="M2,2 L2,6 L4,4" style={{ fill: arrowLine.lineColor }} />
    </marker>
  )
}

export function ArrowLine({ drawing, arrowLine, onClick }: IArrowLineProps) {
  const pathData =
    'M ' +
    arrowLine.points
      .map((p) => {
        return `${p.x} ${p.y}`
      })
      .join(' L ')

  return (
    <path
      onClick={onClick}
      id={arrowLine.id}
      className={classnames(styles.path, { [styles.lineHover]: !drawing })}
      d={pathData}
      stroke={arrowLine.lineColor}
      strokeWidth={arrowLine.lineWidth}
      markerEnd={`url(#marker-${arrowLine.id})`}
    />
  )
}

export function createArrowLine(point: IPoint, workingDrawTool: IDrawingTool): IArrowLine {
  return {
    id: id(),
    lineColor: workingDrawTool.drawColor,
    lineWidth: workingDrawTool.drawWidth,
    type: 'arrow-line',
    points: [point],
  }
}

export function drawArrowLine(arrowLine: IArrowLine, point: IPoint): IArrowLine {
  return {
    ...arrowLine,
    points: [...arrowLine.points, point],
  }
}
