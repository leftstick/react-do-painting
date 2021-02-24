import React, { useEffect, useState, useMemo } from 'react'
import classnames from 'classnames'

import { ILine, IPoint, IShape } from '@/ReactPaintingBoard/IType'
import '@/assets/css/react-painting-icon.css'

import styles from './index.less'

interface ISelectBoxProps {
  shape: IShape
  containerBoundingClientRect: DOMRect | null
  onMoving: (newShape: IShape) => void
  onClose: (shapeId: string) => void
}

export default function SelectBox({
  shape,
  containerBoundingClientRect,
  onMoving,
  onClose,
}: ISelectBoxProps): JSX.Element {
  const [originalStartPoint, setOriginalStartPoint] = useState<IPoint>({ x: 0, y: 0 })
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
      top: rect.top - containerBoundingClientRect.top - 5,
      left: rect.left - containerBoundingClientRect.left - 5,
      width: rect.width + 10,
      height: rect.height + 10,
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
        setOriginalStartPoint(startPoint)
      }}
      onDrag={(e) => {
        if (!onMoving) {
          return
        }
        if (shape.type === 'line') {
          const points = (originalShape as ILine).points
          if (e.clientX === 0 && e.clientY === 0) {
            return
          }
          const clickPosition = {
            x: e.clientX - containerBoundingClientRect.left,
            y: e.clientY - containerBoundingClientRect.top,
          }
          const offset = {
            x: clickPosition.x - originalStartPoint.x,
            y: clickPosition.y - originalStartPoint.y,
          }

          if (
            clickPosition.x - originalClickOffsetToRect.x < 1 ||
            clickPosition.x - originalClickOffsetToRect.x + boxRect.width > containerBoundingClientRect.width ||
            clickPosition.y - originalClickOffsetToRect.y < 1 ||
            clickPosition.y - originalClickOffsetToRect.y + boxRect.height > containerBoundingClientRect.height
          ) {
            return
          }

          onMoving({
            ...shape,
            points: points.map((p) => ({ x: p.x + offset.x, y: p.y + offset.y })),
          } as IShape)
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
    </div>
  )
}
