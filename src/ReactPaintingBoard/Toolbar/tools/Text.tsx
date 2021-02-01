import React, { useContext } from 'react'

import { PaintingStateContext } from '../../state'
import { IAppContext } from '../../IType'
import Icon from '../../Icon'

export default function Text() {
  const { workingDrawTool } = useContext(PaintingStateContext) as IAppContext
  return <Icon type="text" active={workingDrawTool && workingDrawTool.type === 'text'} iconClass="icon-file-word" />
}
