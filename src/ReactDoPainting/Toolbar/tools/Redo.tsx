import React, { useContext } from 'react'

import { PaintingStateContext } from '@/ReactDoPainting/state'
import { IAppContext } from '@/ReactDoPainting/IType'
import { Icon } from '@/ReactDoPainting/common'

export default function Redo() {
  const { redoShapes, redo } = useContext(PaintingStateContext) as IAppContext
  return <Icon type="redo" disabled={!redoShapes.length} iconClass="icon-cw" onClick={redo} />
}
