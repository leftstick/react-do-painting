import React, { useContext } from 'react'

import { PaintingStateContext } from '@/ReactPaintingBoard/state'
import { IAppContext } from '@/ReactPaintingBoard/IType'
import { Icon } from '@/ReactPaintingBoard/common'

export default function Clean() {
  const { shapes, cleanBoard } = useContext(PaintingStateContext) as IAppContext
  return (
    <Icon type="delete" disabled={!shapes.length} iconClass="icon-trash-empty" tooltip="Clean" onClick={cleanBoard} />
  )
}
