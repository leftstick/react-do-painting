import React, { useMemo, useState, useContext } from 'react'

import { PaintingStateContext } from '@/ReactPaintingBoard/state'
import { IAppContext, Color, IDrawMode } from '@/ReactPaintingBoard/IType'
import { Icon, Palette } from '@/ReactPaintingBoard/common'

export default function Circle() {
  const [canPaletteVisible, setPaletteVisible] = useState(false)
  const { workingDrawTool, setWorkingDrawTool, setDrawMode } = useContext(PaintingStateContext) as IAppContext
  const [drawColor, setDrawColor] = useState<string>(workingDrawTool ? workingDrawTool.drawColor : Color.BLACK)
  const [drawWidth, setDrawWidth] = useState(workingDrawTool ? workingDrawTool.drawWidth : 4)
  const isActive = useMemo(() => workingDrawTool && workingDrawTool.type === 'circle', [workingDrawTool])
  return (
    <Icon
      type="circle"
      active={isActive}
      iconClass="icon-circle-empty"
      tooltip="Circle"
      onMouseEnter={() => setPaletteVisible(true)}
      onMouseLeave={() => setPaletteVisible(false)}
      onClick={(e) => {
        if (isActive) {
          return
        }
        setDrawMode(IDrawMode.DRAW)
        setWorkingDrawTool({
          type: 'circle',
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
              type: 'circle',
              drawColor,
              drawWidth: e,
            })
          }}
          onColorChange={(e) => {
            setDrawColor(e)
            setWorkingDrawTool({
              type: 'circle',
              drawColor: e,
              drawWidth,
            })
          }}
        />
      ) : null}
    </Icon>
  )
}
