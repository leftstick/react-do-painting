import React, { CSSProperties } from 'react'

import { isNumeric } from '@/ReactDoPainting/helper'
import { Color } from '@/ReactDoPainting/IType'
import Divider from '../Divider'

import styles from './index.less'

interface IPaletteProps {
  color: string
  width: number
  style?: CSSProperties
  onColorChange: (color: string) => void
  onWidthChange: (width: number) => void
}

const COLORS = [
  Color.BLACK,
  Color.BLUE,
  Color.BLUENESS,
  Color.GREEN,
  Color.PURPLE,
  Color.RED,
  Color.YELLOW,
  Color.WHITE,
]

export default function Palette({ color, width, onColorChange, onWidthChange, style }: IPaletteProps) {
  return (
    <div className={styles.paletteContainer} style={style}>
      <input
        className={styles.inputField}
        value={width}
        type="number"
        data-type="IGNORE_BY_MOUSEUP"
        onChange={(e) => {
          e.stopPropagation()
          e.preventDefault()
          const val = e.target.value
          if (!isNumeric(val)) {
            return
          }
          const width = Number(val)
          if (width > 30 || width <= 0) {
            return
          }
          return onWidthChange(width)
        }}
      />
      <Divider length={30} />

      {COLORS.map((c) => {
        return (
          <div key={c} className={styles.colorPickContainer}>
            <div
              className={styles.colorPick}
              style={{
                backgroundColor: c,
                color: c === Color.WHITE ? '#000' : '#fff',
                cursor: color === c ? 'auto' : 'pointer',
              }}
              data-type="IGNORE_BY_MOUSEUP"
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                onColorChange(c)
              }}
            >
              {color === c ? <>&radic;</> : null}
            </div>
          </div>
        )
      })}
    </div>
  )
}
