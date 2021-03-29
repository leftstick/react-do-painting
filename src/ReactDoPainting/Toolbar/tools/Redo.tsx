import React, { useContext } from 'react'

import { PaintingStateContext } from '@/ReactDoPainting/state'
import { IAppContext } from '@/ReactDoPainting/IType'
import { ToolIcon } from '@/ReactDoPainting/common'

export default function Redo() {
  const { redoShapes, redo } = useContext(PaintingStateContext) as IAppContext
  return <ToolIcon type="redo" disabled={!redoShapes.length} iconClass="cw" onClick={redo} />
}
