import React, { useMemo, useEffect, useContext, useRef, useCallback } from 'react'

import { ILine, IRect, IShape, IPoint, IAppContext, Color, IDrawingTool } from '@/ReactPaintingBoard/IType'
import { PaintingStateContext } from '@/ReactPaintingBoard/state'
import { id } from '@/ReactPaintingBoard/helper'

import styles from './index.less'

function DrawingLine({ line }: { line: ILine }) {
  const pathData =
    'M ' +
    line.points
      .map((p) => {
        return `${p.x} ${p.y}`
      })
      .join(' L ')

  return <path className={styles.path} d={pathData} stroke={line.lineColor} strokeWidth={line.lineWidth} />
}

function DrawingRect({ rect }: { rect: IRect }) {
  return (
    <rect
      x={rect.x}
      y={rect.y}
      width={rect.width}
      height={rect.height}
      style={{
        fill: Color.WHITE,
        stroke: rect.lineColor,
        strokeWidth: rect.lineWidth,
      }}
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

function drawShape(point: IPoint, workingDrawTool: IDrawingTool, shapes: IShape[]): IShape | null {
  if (workingDrawTool.type === 'line') {
    const lastLine = shapes[shapes.length - 1] as ILine
    return drawLine(lastLine, point)
  }
  if (workingDrawTool.type === 'rect') {
    const lastRect = shapes[shapes.length - 1] as IRect
    return drawRect(lastRect, point)
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

export default function SvgDrawingPad() {
  const drawAreaRef = useRef<HTMLDivElement>(null)
  const { drawing, setDrawing, shapes, addShape, updateShape, workingDrawTool } = useContext(
    PaintingStateContext
  ) as IAppContext
  const lines = useMemo(() => shapes.filter((s) => s.type === 'line'), [shapes])
  const rects = useMemo(() => shapes.filter((s) => s.type === 'rect'), [shapes])

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
      if (e.button !== 0 || e.buttons !== 1) {
        return
      }

      const point = relativeCoordinatesForEvent(e)
      if (!point) {
        return
      }

      setDrawing(true)

      addShape(createShape(point, workingDrawTool) as IShape)
    },
    [setDrawing, addShape, workingDrawTool, relativeCoordinatesForEvent]
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
      setDrawing(false)
    },
    [setDrawing]
  )

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mouseup', handleMouseUp)
    }
  })

  return (
    <div
      className={styles.drawingAreaContainer}
      ref={drawAreaRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
    >
      <svg className={styles.drawing}>
        {lines.map((line, index) => (
          <DrawingLine key={line.id} line={line as ILine} />
        ))}
        {rects.map((rect, index) => (
          <DrawingRect key={rect.id} rect={rect as IRect} />
        ))}
      </svg>
    </div>
  )
}
