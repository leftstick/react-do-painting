import React, { useContext } from 'react'

import { PaintingStateContext } from '@/ReactPaintingBoard/state'
import { IAppContext, IDrawMode } from '@/ReactPaintingBoard/IType'
import { Icon } from '@/ReactPaintingBoard/common'

export default function Select() {
  const { setDrawMode, drawMode, setWorkingDrawTool } = useContext(PaintingStateContext) as IAppContext
  return (
    <Icon
      type="select"
      iconClass="icon-move"
      active={drawMode === IDrawMode.SELECT}
      onClick={(e) => {
        setDrawMode(IDrawMode.SELECT)
        setWorkingDrawTool(null)
      }}
    />
  )
}
