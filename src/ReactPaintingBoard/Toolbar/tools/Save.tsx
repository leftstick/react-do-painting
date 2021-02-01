import React, { useContext } from 'react'

import { PaintingStateContext } from '../../state'
import { IAppContext } from '../../IType'
import Icon from '../../Icon'

export default function Save() {
  const { shapes } = useContext(PaintingStateContext) as IAppContext
  return <Icon type="save" disabled={!shapes.length} iconClass="icon-download" tooltip="Save" />
}
