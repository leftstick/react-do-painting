import React, { useContext } from 'react'

import { PaintingStateContext } from '@/ReactPaintingBoard/state'
import { Divider } from '@/ReactPaintingBoard/common'

import { Undo, Redo, Select, Pen, Text, Rect, Circle, Eraser, Clean, Save } from '@/ReactPaintingBoard/Toolbar/tools'

import styles from './index.less'

export default function Toolbar() {
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
      <Eraser />
      <Clean />
      <Divider length={25} />
      <Save />
    </div>
  )
}