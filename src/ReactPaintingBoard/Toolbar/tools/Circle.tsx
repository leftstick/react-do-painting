import React, { useContext } from 'react'

import { PaintingStateContext } from '@/ReactPaintingBoard/state'
import { IAppContext } from '@/ReactPaintingBoard/IType'
import { Icon } from '@/ReactPaintingBoard/common'

export default function Circle() {
  const { workingDrawTool } = useContext(PaintingStateContext) as IAppContext
  return (
    <Icon
      type="circle"
      active={workingDrawTool && workingDrawTool.type === 'circle'}
      iconClass="icon-circle-empty"
      tooltip="Circle"
    />
  )
}
