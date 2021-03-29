import React from 'react'

import { Color } from '@/ReactDoPainting/IType'
import BaseDrawTool from './BaseDrawTool'

export default function Circle() {
  return (
    <BaseDrawTool type="circle" iconClass="circle-empty" tooltip="Circle" defaultColor={Color.BLACK} defaultWidth={4} />
  )
}
