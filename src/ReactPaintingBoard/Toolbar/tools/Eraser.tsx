import React, { useContext } from 'react'

import { PaintingStateContext } from '../../state'
import { IAppContext } from '../../IType'
import Icon from '../../Icon'

export default function Eraser() {
  const { shapes } = useContext(PaintingStateContext) as IAppContext
  return <Icon type="eraser" disabled={!shapes.length} iconClass="icon-eraser" />
}
