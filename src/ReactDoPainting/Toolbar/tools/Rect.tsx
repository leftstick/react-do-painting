import React from 'react'

import { Color } from '@/ReactDoPainting/IType'
import BaseDrawTool from './BaseDrawTool'

export default function Rect() {
  return (
    <BaseDrawTool type="rect" iconClass="columns" tooltip="Rectangle" defaultColor={Color.BLACK} defaultWidth={4} />
  )
}
