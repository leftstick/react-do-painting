import React, { useContext } from 'react'

import { PaintingStateContext } from '../../state'
import { IAppContext } from '../../IType'
import Icon from '../../Icon'

export default function Rect() {
  const { workingDrawTool } = useContext(PaintingStateContext) as IAppContext
  return (
    <Icon
      type="rect"
      active={workingDrawTool && workingDrawTool.type === 'rect'}
      iconClass="icon-columns"
      tooltip="Rectangle"
    />
  )
}
