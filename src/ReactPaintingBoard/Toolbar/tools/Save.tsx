import React, { useContext } from 'react'

import { PaintingStateContext } from '@/ReactPaintingBoard/state'
import { IAppContext } from '@/ReactPaintingBoard/IType'
import { Icon } from '@/ReactPaintingBoard/common'

export default function Save() {
  const { shapes } = useContext(PaintingStateContext) as IAppContext
  return <Icon type="save" disabled={!shapes.length} iconClass="icon-download" tooltip="Save" />
}
