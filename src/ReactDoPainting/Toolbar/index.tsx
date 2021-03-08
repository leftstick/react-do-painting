import React, { useContext } from 'react'

import { PaintingStateContext } from '@/ReactDoPainting/state'
import { Divider } from '@/ReactDoPainting/common'

import { Undo, Redo, Select, Pen, Text, Rect, Circle, Clean, Save } from '@/ReactDoPainting/Toolbar/tools'

import styles from './index.less'

interface IToolbarProps {
  padId: string
}

export default function Toolbar({ padId }: IToolbarProps) {
  const ctx = useContext(PaintingStateContext)

  if (!ctx) {
    throw new Error('context load error')
  }

  return (
    <div className={styles.toolbarContainerAtTop}>
      <Undo />
      <Redo />
      <Divider length={25} />
      <Select />
      <Pen />
      <Text />
      <Rect />
      <Circle />
      <Divider length={25} />
      <Clean />
      <Divider length={25} />
      <Save padId={padId} />
    </div>
  )
}
