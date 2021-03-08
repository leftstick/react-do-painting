import React, { useContext } from 'react'

import { PaintingStateContext } from '@/ReactDoPainting/state'
import { IAppContext } from '@/ReactDoPainting/IType'
import { Icon } from '@/ReactDoPainting/common'

export default function Clean() {
  const { shapes, cleanBoard } = useContext(PaintingStateContext) as IAppContext
  return (
    <Icon type="delete" disabled={!shapes.length} iconClass="icon-trash-empty" tooltip="Clean" onClick={cleanBoard} />
  )
}
