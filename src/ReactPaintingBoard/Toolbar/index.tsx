import React, { useContext } from 'react'

import { PaintingStateContext } from '../state'
import Divider from '../Divider'

import Undo from './tools/Undo'
import Redo from './tools/Redo'
import Select from './tools/Select'
import Pen from './tools/Pen'
import Text from './tools/Text'
import Rect from './tools/Rect'
import Circle from './tools/Circle'
import Eraser from './tools/Eraser'
import Clean from './tools/Clean'
import Save from './tools/Save'

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
