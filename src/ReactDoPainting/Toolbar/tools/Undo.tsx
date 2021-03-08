import React, { useContext } from 'react'

import { PaintingStateContext } from '@/ReactDoPainting/state'
import { IAppContext } from '@/ReactDoPainting/IType'
import { Icon } from '@/ReactDoPainting/common'

export default function Undo() {
  const { shapes, undo } = useContext(PaintingStateContext) as IAppContext
  return <Icon type="undo" disabled={!shapes.length} iconClass="icon-ccw" onClick={undo} />
}
