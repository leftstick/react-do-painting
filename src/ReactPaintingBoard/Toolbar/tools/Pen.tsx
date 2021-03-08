import React, { useMemo, useContext, useState } from 'react'

import { PaintingStateContext } from '@/ReactPaintingBoard/state'
import { Color, IAppContext, IDrawMode } from '@/ReactPaintingBoard/IType'
import { Icon, Palette } from '@/ReactPaintingBoard/common'

export default function Pen() {
  const [canPaletteVisible, setPaletteVisible] = useState(false)
  const { workingDrawTool, setWorkingDrawTool, setDrawMode } = useContext(PaintingStateContext) as IAppContext
  const [drawColor, setDrawColor] = useState<string>(workingDrawTool ? workingDrawTool.drawColor : Color.BLACK)
  const [drawWidth, setDrawWidth] = useState(workingDrawTool ? workingDrawTool.drawWidth : 4)
  const isActive = useMemo(() => workingDrawTool && workingDrawTool.type === 'line', [workingDrawTool])

  return (
    <Icon
      type="line"
      active={isActive}
      iconClass="icon-pencil"
      tooltip="Pen"
      onMouseEnter={() => setPaletteVisible(true)}
      onMouseLeave={() => setPaletteVisible(false)}
      onClick={(e) => {
        if (isActive) {
          return
        }
        setDrawMode(IDrawMode.DRAW)
        setWorkingDrawTool({
          type: 'line',
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
              type: 'line',
              drawColor,
              drawWidth: e,
            })
          }}
          onColorChange={(e) => {
            setDrawColor(e)
            setWorkingDrawTool({
              type: 'line',
              drawColor: e,
              drawWidth,
            })
          }}
        />
      ) : null}
    </Icon>
  )
}
