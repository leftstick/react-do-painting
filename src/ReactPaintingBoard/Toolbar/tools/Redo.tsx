import React, { useContext } from 'react'

import { PaintingStateContext } from '@/ReactPaintingBoard/state'
import { IAppContext } from '@/ReactPaintingBoard/IType'
import { Icon } from '@/ReactPaintingBoard/common'

export default function Redo() {
  const { redoShapes, redo } = useContext(PaintingStateContext) as IAppContext
  return <Icon type="redo" disabled={!redoShapes.length} iconClass="icon-cw" onClick={redo} />
}
