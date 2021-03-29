import React from 'react'

import { Color } from '@/ReactDoPainting/IType'
import BaseDrawTool from './BaseDrawTool'

export default function Pen() {
  return <BaseDrawTool type="line" iconClass="pencil" tooltip="Pen" defaultColor={Color.BLACK} defaultWidth={4} />
}
