import React, { useContext } from 'react'

import { PaintingStateContext } from '@/ReactDoPainting/state'
import { IAppContext } from '@/ReactDoPainting/IType'
import { ToolIcon } from '@/ReactDoPainting/common'

export default function Clean() {
  const { shapes, cleanBoard } = useContext(PaintingStateContext) as IAppContext
  return (
    <ToolIcon type="delete" disabled={!shapes.length} iconClass="trash-empty" tooltip="Clean" onClick={cleanBoard} />
  )
}
