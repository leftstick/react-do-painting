import React, { useContext } from 'react'

import { PaintingStateContext } from '@/ReactPaintingBoard/state'
import { IAppContext } from '@/ReactPaintingBoard/IType'
import { Icon } from '@/ReactPaintingBoard/common'

export default function Rect() {
  const { workingDrawTool } = useContext(PaintingStateContext) as IAppContext
  return (
    <Icon
      type="rect"
      active={workingDrawTool && workingDrawTool.type === 'rect'}
      iconClass="icon-columns"
      tooltip="Rectangle"
    />
  )
}
