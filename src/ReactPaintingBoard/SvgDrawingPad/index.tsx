import React, { useMemo, useContext, useRef, useCallback, useEffect, useState } from 'react'
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

import {
  Line,
  createLine,
  drawLine,
  Rect,
  createRect,
  drawRect,
  Ellipse,
  createEllipse,
  drawEllipse,
  DivText,
  createText,
} from './shapes'
import SelectBox from './SelectBox'

import styles from './index.less'

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

function cleanJustClickedShape(shapes: IShape[], removeShape: (shapeId: string) => void) {
  if (!shapes.length) {
    return false
  }
  const lastShape = shapes[shapes.length - 1]
  if (lastShape.type === 'line' && (lastShape as ILine).points.length === 1) {
    removeShape(lastShape.id)
    return true
  }
  if (lastShape.type === 'rect' && ((lastShape as IRect).width <= 1 || (lastShape as IRect).height <= 1)) {
    removeShape(lastShape.id)
    return true
  }
  if (lastShape.type === 'circle' && ((lastShape as IEllipse).rx <= 1 || (lastShape as IEllipse).ry <= 1)) {
    removeShape(lastShape.id)
    return true
  }
  return false
}

interface ISvgDrawingPadProps {
  id: string
}

export default function SvgDrawingPad({ id }: ISvgDrawingPadProps) {
  const drawAreaRef = useRef<HTMLDivElement>(null)
  const [cleanUnfinishedShapeThreshold, setCleanUnfinishedShapeThreshold] = useState<number>(0)
  const {
    drawing,
    setDrawing,
    drawMode,
    setDrawMode,
    shapes,
    addShape,
    updateShape,
    workingDrawTool,
    setWorkingDrawTool,
    removeShape,
    selectedShape,
    setSelectedShape,
    cleanRedoShapes,
  } = useContext(PaintingStateContext) as IAppContext
  const lines = useMemo(() => shapes.filter((s) => s.type === 'line'), [shapes])
  const rects = useMemo(() => shapes.filter((s) => s.type === 'rect'), [shapes])
  const ellipses = useMemo(() => shapes.filter((s) => s.type === 'circle'), [shapes])
  const divTexts = useMemo(() => shapes.filter((s) => s.type === 'text'), [shapes])

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
      // not a valid click point
      const point = relativeCoordinatesForEvent(e)
      if (!point) {
        return
      }

      // draw mode
      if (drawMode === IDrawMode.DRAW) {
        setDrawing(true)
        const newShape = createShape(point, workingDrawTool) as IShape
        addShape(newShape)
      }

      // select mode
      if (drawMode === IDrawMode.SELECT) {
        return
      }
    },
    [setDrawing, addShape, drawMode, workingDrawTool, relativeCoordinatesForEvent]
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

  const cleanUnfinishedShape = useCallback(() => {
    // remove just clicked shape
    const removed = cleanJustClickedShape(shapes, removeShape)
    if (!removed) {
      cleanRedoShapes()
    }
  }, [cleanRedoShapes, shapes, removeShape])

  const handleMouseUp = useCallback(
    (e) => {
      // ignore if click from toolbar, selectbox
      if (e.target.dataset && e.target.dataset.type === 'IGNORE_BY_MOUSEUP') {
        return
      }

      console.log('up')

      if (drawMode === IDrawMode.DRAW) {
        // end drawing
        setDrawing(false)

        setCleanUnfinishedShapeThreshold(new Date().getTime())
      }

      if (drawMode !== IDrawMode.SELECT) {
        setDrawMode(IDrawMode.SELECT)
        setWorkingDrawTool(null)
      }

      if (drawMode === IDrawMode.SELECT) {
        if (selectedShape) {
          setSelectedShape(null)
        }
      }
    },
    [
      setDrawing,
      drawMode,
      setDrawMode,
      setWorkingDrawTool,
      selectedShape,
      setSelectedShape,
      setCleanUnfinishedShapeThreshold,
    ]
  )

  const selectShape = useCallback(
    (e, shape: IShape) => {
      e.stopPropagation()
      e.preventDefault()
      if (selectedShape && selectedShape.id === shape.id) {
        return
      }
      setSelectedShape(shape)
    },
    [selectedShape, setSelectedShape]
  )

  const moving = useCallback(
    (shape: IShape) => {
      if (!selectedShape) {
        return
      }
      console.log('moving')
      updateShape(selectedShape.id, shape)
      setSelectedShape(shape)
    },
    [selectedShape, updateShape, setSelectedShape]
  )

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp, false)
    return () => {
      document.removeEventListener('mouseup', handleMouseUp, false)
    }
  }, [handleMouseUp, shapes])

  useEffect(() => {
    cleanUnfinishedShape()
    // Note: only watch cleanUnfinishedShapeThreshold here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cleanUnfinishedShapeThreshold])

  return (
    <div
      id={id}
      className={styles.drawingAreaContainer}
      ref={drawAreaRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onDragOver={(e) => e.preventDefault()}
    >
      <svg className={styles.drawing}>
        {lines.map((line, index) => (
          <Line
            drawing={drawing}
            key={line.id}
            line={line as ILine}
            onClick={(e) => {
              selectShape(e, line)
            }}
          />
        ))}
        {rects.map((rect, index) => (
          <Rect
            drawing={drawing}
            key={rect.id}
            rect={rect as IRect}
            onClick={(e) => {
              selectShape(e, rect)
            }}
          />
        ))}
        {ellipses.map((ellipse, index) => (
          <Ellipse
            drawing={drawing}
            key={ellipse.id}
            ellipse={ellipse as IEllipse}
            onClick={(e) => {
              selectShape(e, ellipse)
            }}
          />
        ))}
      </svg>
      {divTexts.map((text, index) => (
        <DivText
          key={text.id}
          drawing={drawing}
          text={text as IText}
          onClick={(e) => {
            selectShape(e, text)
          }}
          onDoubleClick={(e) => {
            updateShape(text.id, {
              ...text,
              editing: true,
            } as IShape)
          }}
          onChange={(words) => {
            updateShape(text.id, {
              ...text,
              words,
              editing: false,
            } as IShape)
          }}
        />
      ))}

      {selectedShape && (
        <SelectBox
          shape={selectedShape}
          containerBoundingClientRect={drawAreaRef.current && drawAreaRef.current.getBoundingClientRect()}
          onMoving={moving}
          onClose={removeShape}
          onShapeChange={(id, shape) => {
            updateShape(id, shape)
          }}
        />
      )}
    </div>
  )
}
