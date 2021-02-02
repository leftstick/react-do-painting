import React, { useMemo, useContext, useRef, useCallback } from 'react'
import classnames from 'classnames'
import {
  ILine,
  IRect,
  IShape,
  IPoint,
  IAppContext,
  IEllipse,
  IText,
  IDrawingTool,
  IDrawMode,
} from '@/ReactPaintingBoard/IType'
import { PaintingStateContext } from '@/ReactPaintingBoard/state'
import { id } from '@/ReactPaintingBoard/helper'

import styles from './index.less'

function DrawingLine({ drawing, line }: { line: ILine; drawing: boolean }) {
  const pathData =
    'M ' +
    line.points
      .map((p) => {
        return `${p.x} ${p.y}`
      })
      .join(' L ')

  return (
    <path
      id={line.id}
      className={classnames(styles.path, { [styles.lineHover]: !drawing })}
      d={pathData}
      stroke={line.lineColor}
      strokeWidth={line.lineWidth}
    />
  )
}

function DrawingRect({ drawing, rect }: { rect: IRect; drawing: boolean }) {
  return (
    <rect
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

function DrawingEllipse({ drawing, ellipse }: { ellipse: IEllipse; drawing: boolean }) {
  return (
    <ellipse
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

function createShape(point: IPoint, workingDrawTool: IDrawingTool): IShape | null {
  if (workingDrawTool.type === 'line') {
    return createLine(point, workingDrawTool)
  }
  if (workingDrawTool.type === 'rect') {
    return createRect(point, workingDrawTool)
  }
  if (workingDrawTool.type === 'circle') {
    return createEllipse(point, workingDrawTool)
  }
  if (workingDrawTool.type === 'text') {
    return createText(point, workingDrawTool)
  }
  return null
}

function createLine(point: IPoint, workingDrawTool: IDrawingTool): ILine {
  return {
    id: id(),
    lineColor: workingDrawTool.drawColor,
    lineWidth: workingDrawTool.drawWidth,
    type: 'line',
    points: [point],
  }
}

function createRect(point: IPoint, workingDrawTool: IDrawingTool): IRect {
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

function createEllipse(point: IPoint, workingDrawTool: IDrawingTool): IEllipse {
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

function createText(point: IPoint, workingDrawTool: IDrawingTool): IText {
  return {
    id: id(),
    lineColor: workingDrawTool.drawColor,
    lineWidth: workingDrawTool.drawWidth,
    type: 'text',
    words: 'Type words here',
  }
}

function drawShape(point: IPoint, workingDrawTool: IDrawingTool, shapes: IShape[]): IShape | null {
  if (workingDrawTool.type === 'line') {
    const lastLine = shapes[shapes.length - 1] as ILine
    return drawLine(lastLine, point)
  }
  if (workingDrawTool.type === 'rect') {
    const lastRect = shapes[shapes.length - 1] as IRect
    return drawRect(lastRect, point)
  }
  if (workingDrawTool.type === 'circle') {
    const lastEllipse = shapes[shapes.length - 1] as IEllipse
    return drawEllipse(lastEllipse, point)
  }
  if (workingDrawTool.type === 'text') {
    return null
  }
  return null
}

function drawLine(line: ILine, point: IPoint): ILine {
  return {
    ...line,
    points: [...line.points, point],
  }
}

function drawRect(rect: IRect, point: IPoint): IRect {
  return {
    ...rect,
    width: point.x - rect.x,
    height: point.y - rect.y,
  }
}

function drawEllipse(ellipse: IEllipse, point: IPoint): IEllipse {
  return {
    ...ellipse,
    rx: point.x - ellipse.cx,
    ry: point.y - ellipse.cy,
  }
}

function cleanJustClickedShape(shapes: IShape[], removeShape: (shape: IShape) => void) {
  const lastShape = shapes[shapes.length - 1]
  if (lastShape.type === 'line' && (lastShape as ILine).points.length === 1) {
    removeShape(lastShape)
  }
  if (lastShape.type === 'rect' && ((lastShape as IRect).width <= 1 || (lastShape as IRect).height <= 1)) {
    removeShape(lastShape)
  }
}

export default function SvgDrawingPad() {
  const drawAreaRef = useRef<HTMLDivElement>(null)
  const { drawing, setDrawing, drawMode, shapes, addShape, updateShape, workingDrawTool, removeShape } = useContext(
    PaintingStateContext
  ) as IAppContext
  const lines = useMemo(() => shapes.filter((s) => s.type === 'line'), [shapes])
  const rects = useMemo(() => shapes.filter((s) => s.type === 'rect'), [shapes])
  const ellipses = useMemo(() => shapes.filter((s) => s.type === 'circle'), [shapes])

  const relativeCoordinatesForEvent = useCallback<(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => IPoint | null>(
    (e) => {
      if (!drawAreaRef.current) {
        return null
      }
      const boundingRect = drawAreaRef.current.getBoundingClientRect()
      return {
        x: e.clientX - boundingRect.left,
        y: e.clientY - boundingRect.top,
      }
    },
    [drawAreaRef]
  )

  const handleMouseDown = useCallback<(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void>(
    (e) => {
      // not left click, ignore
      if (e.button !== 0 || e.buttons !== 1) {
        return
      }

      // not draw mode, ignore
      if (drawMode !== IDrawMode.DRAW) {
        return
      }

      const point = relativeCoordinatesForEvent(e)
      if (!point) {
        return
      }

      setDrawing(true)
      const newShape = createShape(point, workingDrawTool) as IShape
      addShape(newShape)
    },
    [setDrawing, addShape, drawMode, workingDrawTool, relativeCoordinatesForEvent]
  )

  const handleMouseMove = useCallback<(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void>(
    (e) => {
      if (!drawing) {
        return
      }

      const point = relativeCoordinatesForEvent(e)
      if (!point) {
        return
      }

      const lastShape = shapes[shapes.length - 1]

      updateShape(lastShape.id, drawShape(point, workingDrawTool, shapes) as IShape)
    },
    [drawing, updateShape, shapes, workingDrawTool, relativeCoordinatesForEvent]
  )

  const handleMouseUp = useCallback(
    (e) => {
      if (drawMode !== IDrawMode.DRAW) {
        return
      }
      setDrawing(false)

      // remove just click line
      cleanJustClickedShape(shapes, removeShape)
    },
    [setDrawing, drawMode, shapes, removeShape]
  )

  return (
    <div
      className={styles.drawingAreaContainer}
      ref={drawAreaRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <svg className={styles.drawing}>
        {lines.map((line, index) => (
          <DrawingLine drawing={drawing} key={line.id} line={line as ILine} />
        ))}
        {rects.map((rect, index) => (
          <DrawingRect drawing={drawing} key={rect.id} rect={rect as IRect} />
        ))}
        {ellipses.map((ellipse, index) => (
          <DrawingEllipse drawing={drawing} key={ellipse.id} ellipse={ellipse as IEllipse} />
        ))}
      </svg>
    </div>
  )
}
