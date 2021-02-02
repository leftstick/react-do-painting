import React from 'react'

import { isNumeric } from '@/ReactPaintingBoard/helper'
import { Color } from '@/ReactPaintingBoard/IType'
import { Divider } from '@/ReactPaintingBoard/common'

import styles from './index.less'

interface IPaletteProps {
  color: string
  width: number
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

export default function Palette({ color, width, onColorChange, onWidthChange }: IPaletteProps) {
  return (
    <div className={styles.paletteContainer}>
      <input
        className={styles.inputField}
        value={width}
        type="number"
        onChange={(e) => {
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
              onClick={() => {
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
