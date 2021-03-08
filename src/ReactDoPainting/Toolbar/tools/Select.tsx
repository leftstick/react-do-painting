import React, { useContext } from 'react'

import { PaintingStateContext } from '@/ReactDoPainting/state'
import { IAppContext, IDrawMode } from '@/ReactDoPainting/IType'
import { Icon } from '@/ReactDoPainting/common'

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
