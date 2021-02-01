import React, { useContext } from 'react'

import { PaintingStateContext } from '../../state'
import { IAppContext } from '../../IType'
import Icon from '../../Icon'

export default function Circle() {
  const { workingDrawTool } = useContext(PaintingStateContext) as IAppContext
  return (
    <Icon
      type="circle"
      active={workingDrawTool && workingDrawTool.type === 'circle'}
      iconClass="icon-circle-empty"
      tooltip="Circle"
    />
  )
}
