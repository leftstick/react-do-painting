import React, { useContext } from 'react'

import { PaintingStateContext } from '../../state'
import { IAppContext } from '../../IType'
import Icon from '../../Icon'

export default function Redo() {
  const { redoShapes } = useContext(PaintingStateContext) as IAppContext
  return <Icon type="redo" disabled={!redoShapes.length} iconClass="icon-cw" />
}
