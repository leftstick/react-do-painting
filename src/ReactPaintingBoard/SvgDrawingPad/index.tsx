import React, { useMemo, useContext, useRef, useCallback, useEffect } from 'react'
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

function DrawingSvgText({
  drawing,
  text,
  onDoubleClick,
}: {
  text: IText
  drawing: boolean
  onDoubleClick: (e: React.MouseEvent<SVGTextElement, MouseEvent>) => void
}) {
  const lines = text.words.split('\n')
  if (lines.length === 1) {
    return (
      <text
        id={text.id}
        x={text.x}
        y={text.y}
        onDoubleClick={onDoubleClick}
        onMouseEnter={() => {
          console.log('enter here')
        }}
        onMouseLeave={() => {
          console.log('leave here')
        }}
        style={{
          fontSize: text.lineWidth,
          fill: text.lineColor,
        }}
        className={classnames({ [styles.textHover]: !drawing })}
      >
        {text.words}
      </text>
    )
  }

  return (
    <text
      id={text.id}
      x={text.x}
      y={text.y}
      onDoubleClick={onDoubleClick}
      style={{
        fontSize: text.lineWidth,
        fill: text.lineColor,
      }}
      className={classnames({ [styles.textHover]: !drawing })}
    >
      {lines.map((line, index) => {
        return (
          <tspan x={text.x} y={text.y + index * text.lineWidth}>
            {line}
          </tspan>
        )
      })}
    </text>
  )
}

function DrawingEditableText({ text, onChange }: { text: IText; onChange: (words: string) => void }) {
  const divRef = useRef<HTMLDivElement>(null)
  return (
    <div
      ref={divRef}
      style={{ left: text.x, top: text.y - text.lineWidth, fontSize: text.lineWidth, color: text.lineColor }}
      className={styles.editingText}
      contentEditable
      onBlur={() => {
        onChange && onChange(divRef.current?.innerText!)
      }}
      dangerouslySetInnerHTML={{ __html: text.words.replace(/\n/g, '<br/>') }}
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
    x: point.x,
    y: point.y,
    words: 'Type words here',
    editing: true,
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

function drawRect(rect: IRect, point: IPoint): IRect | null {
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

function drawEllipse(ellipse: IEllipse, point: IPoint): IEllipse | null {
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

function cleanJustClickedShape(shapes: IShape[], removeShape: (shape: IShape) => void) {
  if (!shapes.length) {
    return
  }
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
  const svgTexts = useMemo(() => shapes.filter((s) => s.type === 'text' && !(s as IText).editing), [shapes])
  const divTexts = useMemo(() => shapes.filter((s) => s.type === 'text' && (s as IText).editing), [shapes])

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
      console.log('mouse down here')
      // not left click, ignore
      if (e.button !== 0 || e.buttons !== 1) {
        return
      }
      // not a valid click point
      const point = relativeCoordinatesForEvent(e)
      if (!point) {
        return
      }

      // draw mode
      if (drawMode === IDrawMode.DRAW) {
        setDrawing(true)
        // ignore if there is editing text exist
        if (divTexts.length) {
          return
        }
        const newShape = createShape(point, workingDrawTool) as IShape
        addShape(newShape)
      }

      // select mode
      if (drawMode === IDrawMode.SELECT) {
        return
      }
    },
    [setDrawing, addShape, drawMode, workingDrawTool, relativeCoordinatesForEvent, divTexts]
  )

  const handleMouseMove = useCallback<(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void>(
    (e) => {
      // not a valid move point
      const point = relativeCoordinatesForEvent(e)
      if (!point) {
        return
      }

      // draw mode
      if (drawMode === IDrawMode.DRAW) {
        // ignore if not started
        if (!drawing) {
          return
        }

        const lastShape = shapes[shapes.length - 1]

        updateShape(lastShape.id, drawShape(point, workingDrawTool, shapes) as IShape)
      }
    },
    [drawing, drawMode, updateShape, shapes, workingDrawTool, relativeCoordinatesForEvent]
  )

  const handleMouseUp = useCallback(
    (e) => {
      if (drawMode === IDrawMode.DRAW) {
        // end drawing
        setDrawing(false)
        // remove just clicked shape
        cleanJustClickedShape(shapes, removeShape)
        return
      }
    },
    [setDrawing, drawMode, shapes, removeShape]
  )

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp, false)
    return () => {
      document.removeEventListener('mouseup', handleMouseUp, false)
    }
  }, [handleMouseUp])

  return (
    <div
      className={styles.drawingAreaContainer}
      ref={drawAreaRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
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
        {svgTexts.map((text, index) => (
          <DrawingSvgText
            drawing={drawing}
            key={text.id}
            text={text as IText}
            onDoubleClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              updateShape(text.id, {
                ...text,
                editing: true,
              } as IShape)
            }}
          />
        ))}
      </svg>
      {divTexts.map((text, index) => (
        <DrawingEditableText
          key={text.id}
          text={text as IText}
          onChange={(words) => {
            updateShape(text.id, {
              ...text,
              words,
              editing: false,
            } as IShape)
          }}
        />
      ))}
    </div>
  )
}
