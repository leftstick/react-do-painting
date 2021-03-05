import React, { useContext } from 'react'

import { PaintingStateContext } from '@/ReactPaintingBoard/state'
import { IAppContext } from '@/ReactPaintingBoard/IType'
import { Icon } from '@/ReactPaintingBoard/common'
import { downloadAsPng } from '@/ReactPaintingBoard/helper'

interface ISaveProps {
  padId: string
}

export default function Save({ padId }: ISaveProps) {
  const { shapes } = useContext(PaintingStateContext) as IAppContext
  return (
    <Icon
      type="save"
      disabled={!shapes.length}
      iconClass="icon-download"
      tooltip="Save"
      onClick={() => {
        downloadAsPng(document.getElementById(padId)!, 'exported-painting.png')
      }}
    />
  )
}
