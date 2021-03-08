import React, { useEffect, useState, useMemo } from 'react'
import classnames from 'classnames'

import { ILine, IPoint, IRect, IShape, IEllipse, IText } from '@/ReactPaintingBoard/IType'
import { Palette } from '@/ReactPaintingBoard/common'
import '@/assets/css/react-painting-icon.css'

import styles from './index.less'

interface ISelectBoxProps {
  shape: IShape
  containerBoundingClientRect: DOMRect | null
  onMoving: (newShape: IShape) => void
  onClose: (shapeId: string) => void
  onShapeChange: (shapeId: string, shape: IShape) => void
}

function toLine(line: ILine, clickPosition: IPoint, originalClickPosition: IPoint): IShape {
  const points = line.points
  const offset = {
    x: clickPosition.x - originalClickPosition.x,
    y: clickPosition.y - originalClickPosition.y,
  }

  return {
    ...line,
    points: points.map((p) => ({ x: p.x + offset.x, y: p.y + offset.y })),
  } as IShape
}

function toRect(rect: IRect, clickPosition: IPoint, originalClickPosition: IPoint): IShape {
  const offset = {
    x: clickPosition.x - originalClickPosition.x,
    y: clickPosition.y - originalClickPosition.y,
  }

  return {
    ...rect,
    x: rect.x + offset.x,
    y: rect.y + offset.y,
  } as IShape
}

function toEllipse(ellipse: IEllipse, clickPosition: IPoint, originalClickPosition: IPoint): IShape {
  const offset = {
    x: clickPosition.x - originalClickPosition.x,
    y: clickPosition.y - originalClickPosition.y,
  }

  return {
    ...ellipse,
    cx: ellipse.cx + offset.x,
    cy: ellipse.cy + offset.y,
  } as IShape
}

function toText(text: IText, clickPosition: IPoint, originalClickPosition: IPoint): IShape {
  const offset = {
    x: clickPosition.x - originalClickPosition.x,
    y: clickPosition.y - originalClickPosition.y,
  }

  return {
    ...text,
    x: text.x + offset.x,
    y: text.y + offset.y,
  } as IShape
}

export default function SelectBox({
  shape,
  containerBoundingClientRect,
  onMoving,
  onClose,
  onShapeChange,
}: ISelectBoxProps): JSX.Element {
  const [originalClickPosition, setOriginalClickPosition] = useState<IPoint>({ x: 0, y: 0 })
  const [originalClickOffsetToRect, setOriginalClickOffsetToRect] = useState<IPoint>({ x: 0, y: 0 })
  const [originalShape, setOriginalShape] = useState<IShape>(shape)
  const [resetOriginalShapeTrigger, setResetOriginalShapeTrigger] = useState<number>(0)
  const shapeId = shape.id

  const boxRect = useMemo(() => {
    if (!shapeId || !containerBoundingClientRect) {
      return {
        top: -1,
        left: -1,
        width: 0,
        height: 0,
      }
    }
    const rect = document.querySelector(`#${shapeId}`)?.getBoundingClientRect()
    if (!rect) {
      return {
        top: -1,
        left: -1,
        width: 0,
        height: 0,
      }
    }
    return {
      top: rect.top - containerBoundingClientRect.top - 8,
      left: rect.left - containerBoundingClientRect.left - 8,
      width: rect.width + 16,
      height: rect.height + 16,
    }
  }, [shapeId, containerBoundingClientRect])

  useEffect(() => {
    if (!shapeId) {
      return
    }
    setOriginalShape(shape)

    // Note: only watch shapeId here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shapeId, setOriginalShape, resetOriginalShapeTrigger])

  if (!containerBoundingClientRect) {
    return <></>
  }

  return (
    <div
      data-type="IGNORE_BY_MOUSEUP"
      draggable
      style={{
        position: 'absolute',
        top: boxRect.top,
        left: boxRect.left,
        width: boxRect.width,
        height: boxRect.height,
        border: '1px solid #d3d3d3',
      }}
      onDragStart={(e) => {
        const startPoint = {
          x: e.clientX - containerBoundingClientRect.left,
          y: e.clientY - containerBoundingClientRect.top,
        }

        const clickOffsetToBox = {
          x: startPoint.x - boxRect.left,
          y: startPoint.y - boxRect.top,
        }

        setOriginalClickOffsetToRect(clickOffsetToBox)
        setOriginalClickPosition(startPoint)
      }}
      onDrag={(e) => {
        if (!onMoving) {
          return
        }
        if (e.clientX === 0 && e.clientY === 0) {
          return
        }
        const clickPosition = {
          x: e.clientX - containerBoundingClientRect.left,
          y: e.clientY - containerBoundingClientRect.top,
        }
        if (
          clickPosition.x - originalClickOffsetToRect.x < 1 ||
          clickPosition.x - originalClickOffsetToRect.x + boxRect.width > containerBoundingClientRect.width ||
          clickPosition.y - originalClickOffsetToRect.y < 1 ||
          clickPosition.y - originalClickOffsetToRect.y + boxRect.height > containerBoundingClientRect.height
        ) {
          return
        }

        let newShape = null

        if (shape.type === 'line') {
          newShape = toLine(originalShape as ILine, clickPosition, originalClickPosition)
        } else if (shape.type === 'rect') {
          newShape = toRect(originalShape as IRect, clickPosition, originalClickPosition)
        } else if (shape.type === 'circle') {
          newShape = toEllipse(originalShape as IEllipse, clickPosition, originalClickPosition)
        } else if (shape.type === 'text') {
          newShape = toText(originalShape as IText, clickPosition, originalClickPosition)
        }

        if (newShape) {
          onMoving(newShape)
        }
      }}
      onDragEnd={(e) => {
        setResetOriginalShapeTrigger(new Date().getTime())
      }}
    >
      <i
        className={classnames(styles.closeBtn, 'icon-cancel-circled')}
        data-type="IGNORE_BY_MOUSEUP"
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
          onClose && onClose(shapeId)
        }}
      />
      <Palette
        style={{ top: boxRect.height, left: -1 }}
        color={shape.lineColor}
        width={shape.lineWidth}
        onColorChange={(color) => {
          onShapeChange(shapeId, { ...shape, lineColor: color } as IShape)
          setResetOriginalShapeTrigger(new Date().getTime())
        }}
        onWidthChange={(width) => {
          onShapeChange(shapeId, { ...shape, lineWidth: width } as IShape)
          setResetOriginalShapeTrigger(new Date().getTime())
        }}
      />
    </div>
  )
}
