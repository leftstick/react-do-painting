import React, { useContext } from 'react'

import { PaintingStateContext } from '../../state'
import { IAppContext } from '../../IType'
import Icon from '../../Icon'

export default function Clean() {
  const { shapes } = useContext(PaintingStateContext) as IAppContext
  return <Icon type="delete" disabled={!shapes.length} iconClass="icon-trash-empty" tooltip="Clean" />
}
