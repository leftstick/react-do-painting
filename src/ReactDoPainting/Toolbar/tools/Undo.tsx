import React, { useContext } from 'react'

import { PaintingStateContext } from '@/ReactDoPainting/state'
import { IAppContext } from '@/ReactDoPainting/IType'
import { ToolIcon } from '@/ReactDoPainting/common'

export default function Undo() {
  const { shapes, undo } = useContext(PaintingStateContext) as IAppContext
  return <ToolIcon type="undo" disabled={!shapes.length} iconClass="ccw" onClick={undo} />
}
