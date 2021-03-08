import React, { useContext } from 'react'

import { PaintingStateContext } from '@/ReactDoPainting/state'
import { IAppContext } from '@/ReactDoPainting/IType'
import { Icon } from '@/ReactDoPainting/common'

export default function Eraser() {
  const { shapes } = useContext(PaintingStateContext) as IAppContext
  return <Icon type="eraser" disabled={!shapes.length} iconClass="icon-eraser" />
}
