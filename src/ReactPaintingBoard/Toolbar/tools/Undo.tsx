import React, { useContext } from 'react'

import { PaintingStateContext } from '../../state'
import { IAppContext } from '../../IType'
import Icon from '../../Icon'

export default function Undo() {
  const { shapes } = useContext(PaintingStateContext) as IAppContext
  return <Icon type="undo" disabled={!shapes.length} iconClass="icon-ccw" />
}
