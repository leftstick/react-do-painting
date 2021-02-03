import React, { useContext, useState, useMemo } from 'react'

import { PaintingStateContext } from '@/ReactPaintingBoard/state'
import { IAppContext, Color, IDrawMode } from '@/ReactPaintingBoard/IType'
import Palette from '../Palette'
import { Icon } from '@/ReactPaintingBoard/common'

export default function Text() {
  const [canPaletteVisible, setPaletteVisible] = useState(false)
  const { workingDrawTool, setWorkingDrawTool, setDrawMode } = useContext(PaintingStateContext) as IAppContext
  const [drawColor, setDrawColor] = useState<string>(workingDrawTool ? workingDrawTool.drawColor : Color.BLACK)
  const [drawWidth, setDrawWidth] = useState(
    workingDrawTool && workingDrawTool.type === 'text' ? workingDrawTool.drawWidth : 18
  )
  const isActive = useMemo(() => workingDrawTool && workingDrawTool.type === 'text', [workingDrawTool])

  return (
    <Icon
      type="text"
      active={isActive}
      iconClass="icon-file-word"
      onMouseEnter={() => setPaletteVisible(true)}
      onMouseLeave={() => setPaletteVisible(false)}
      onClick={(e) => {
        if (isActive) {
          return
        }
        setDrawMode(IDrawMode.DRAW)
        setWorkingDrawTool({
          type: 'text',
          drawColor,
          drawWidth,
        })
      }}
    >
      {canPaletteVisible && isActive ? (
        <Palette
          width={drawWidth}
          color={drawColor}
          onWidthChange={(e) => {
            setDrawWidth(e)
            setWorkingDrawTool({
              type: 'text',
              drawColor,
              drawWidth: e,
            })
          }}
          onColorChange={(e) => {
            setDrawColor(e)
            setWorkingDrawTool({
              type: 'text',
              drawColor: e,
              drawWidth,
            })
          }}
        />
      ) : null}
    </Icon>
  )
}
