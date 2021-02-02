import React, { useContext } from 'react'

import { PaintingStateContext } from '@/ReactPaintingBoard/state'
import { IAppContext } from '@/ReactPaintingBoard/IType'
import { Icon } from '@/ReactPaintingBoard/common'

export default function Text() {
  const { workingDrawTool } = useContext(PaintingStateContext) as IAppContext
  return <Icon type="text" active={workingDrawTool && workingDrawTool.type === 'text'} iconClass="icon-file-word" />
}
