import React, { useState, useCallback } from 'react'

import { Color, IDrawMode, IAppContext, IDrawingTool, IShape } from '@/ReactPaintingBoard/IType'

export const PaintingStateContext = React.createContext<IAppContext | null>(null)

export function PaintingStateProvider(props: any) {
  const [drawing, setDrawing] = useState(false)
  const [drawMode, setDrawMode] = useState(IDrawMode.DRAW)
  const [workingDrawTool, setWorkingDrawTool] = useState<IDrawingTool | null>({
    type: 'line',
    drawColor: Color.BLACK,
    drawWidth: 4,
  })
  const [shapes, setShapes] = useState<IShape[]>([])
  const [redoShapes, setRedoShapes] = useState<IShape[]>([])
  const [selectedShape, setSelectedShape] = useState<IShape>()

  const addShape = useCallback(
    (shape: IShape) => {
      setShapes((sp) => [...sp, shape])
    },
    [setShapes]
  )

  const updateShape = useCallback(
    (id: string, shape: IShape) => {
      setShapes((sp) => {
        return sp.map((s) => {
          if (s.id !== id) {
            return s
          }
          return shape
        })
      })
    },
    [setShapes]
  )

  const removeShape = useCallback(
    (shape: IShape) => {
      setShapes((sp) => sp.filter((s) => s.id !== shape.id))
    },
    [setShapes]
  )

  const addToRedoShapes = useCallback(
    (shape: IShape) => {
      setRedoShapes((sp) => [...sp, shape])
    },
    [setRedoShapes]
  )

  const removeFromRedoShapes = useCallback(
    (shape: IShape) => {
      setRedoShapes((sp) => sp.filter((s) => s.id !== shape.id))
    },
    [setRedoShapes]
  )

  return (
    <PaintingStateContext.Provider
      value={{
        drawing,
        setDrawing,
        drawMode,
        setDrawMode,
        workingDrawTool,
        setWorkingDrawTool,
        shapes,
        addShape,
        updateShape,
        removeShape,
        redoShapes,
        addToRedoShapes,
        removeFromRedoShapes,
        selectedShape,
        setSelectedShape,
      }}
      {...props}
    />
  )
}