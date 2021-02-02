import React, { useContext } from 'react'

import { PaintingStateContext } from '@/ReactPaintingBoard/state'
import { IAppContext } from '@/ReactPaintingBoard/IType'
import { Icon } from '@/ReactPaintingBoard/common'

export default function Undo() {
  const { shapes, undo } = useContext(PaintingStateContext) as IAppContext
  return <Icon type="undo" disabled={!shapes.length} iconClass="icon-ccw" onClick={undo} />
}
