import React from 'react'

import { Color } from '@/ReactDoPainting/IType'
import BaseDrawTool from './BaseDrawTool'

export default function Text() {
  return <BaseDrawTool type="text" iconClass="file-word" tooltip="Text" defaultColor={Color.BLACK} defaultWidth={18} />
}
