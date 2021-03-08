import React, { useContext } from 'react'

import { PaintingStateContext } from '@/ReactDoPainting/state'
import { IAppContext } from '@/ReactDoPainting/IType'
import { Icon } from '@/ReactDoPainting/common'
import { downloadAsPng } from '@/ReactDoPainting/helper'

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
