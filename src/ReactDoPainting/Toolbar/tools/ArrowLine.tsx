import React from 'react'

import { Color } from '@/ReactDoPainting/IType'
import BaseDrawTool from './BaseDrawTool'

export default function ArrowLine() {
  return (
    <BaseDrawTool
      type="arrow-line"
      iconClass="icon-level-down"
      tooltip="Arrow Line"
      defaultColor={Color.BLACK}
      defaultWidth={4}
    />
  )
}
