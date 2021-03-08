import React, { useState, useMemo, useContext } from 'react'

import { PaintingStateContext } from '@/ReactPaintingBoard/state'
import { IAppContext, Color, IDrawMode } from '@/ReactPaintingBoard/IType'
import { Icon, Palette } from '@/ReactPaintingBoard/common'

export default function Rect() {
  const [canPaletteVisible, setPaletteVisible] = useState(false)
  const { workingDrawTool, setWorkingDrawTool, setDrawMode } = useContext(PaintingStateContext) as IAppContext
  const [drawColor, setDrawColor] = useState<string>(workingDrawTool ? workingDrawTool.drawColor : Color.BLACK)
  const [drawWidth, setDrawWidth] = useState(workingDrawTool ? workingDrawTool.drawWidth : 4)
  const isActive = useMemo(() => workingDrawTool && workingDrawTool.type === 'rect', [workingDrawTool])

  return (
    <Icon
      type="rect"
      active={isActive}
      iconClass="icon-columns"
      tooltip="Rectangle"
      onMouseEnter={() => setPaletteVisible(true)}
      onMouseLeave={() => setPaletteVisible(false)}
      onClick={(e) => {
        if (isActive) {
          return
        }
        setDrawMode(IDrawMode.DRAW)
        setWorkingDrawTool({
          type: 'rect',
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
              type: 'rect',
              drawColor,
              drawWidth: e,
            })
          }}
          onColorChange={(e) => {
            setDrawColor(e)
            setWorkingDrawTool({
              type: 'rect',
              drawColor: e,
              drawWidth,
            })
          }}
        />
      ) : null}
    </Icon>
  )
}
