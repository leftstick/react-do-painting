import React, { useState, useMemo, useContext } from 'react'

import { PaintingStateContext } from '@/ReactDoPainting/state'
import { IAppContext, IDrawMode, IShapeType } from '@/ReactDoPainting/IType'
import { ToolIcon, Palette, IToolbarIconClassType } from '@/ReactDoPainting/common'

interface IBaseDrawTool {
  type: IShapeType
  iconClass: IToolbarIconClassType
  tooltip: string
  defaultColor: string
  defaultWidth: number
}

export default function BaseDrawTool({ type, iconClass, tooltip, defaultColor, defaultWidth }: IBaseDrawTool) {
  const [canPaletteVisible, setPaletteVisible] = useState(false)
  const { workingDrawTool, setWorkingDrawTool, setDrawMode } = useContext(PaintingStateContext) as IAppContext
  const [drawColor, setDrawColor] = useState<string>(
    workingDrawTool && workingDrawTool.type === type ? workingDrawTool.drawColor : defaultColor
  )
  const [drawWidth, setDrawWidth] = useState(
    workingDrawTool && workingDrawTool.type === type ? workingDrawTool.drawWidth : defaultWidth
  )
  const isActive = useMemo(() => workingDrawTool && workingDrawTool.type === type, [workingDrawTool, type])
  return (
    <ToolIcon
      type={type}
      active={isActive}
      iconClass={iconClass}
      tooltip={tooltip}
      onMouseEnter={() => setPaletteVisible(true)}
      onMouseLeave={() => setPaletteVisible(false)}
      onClick={(e) => {
        if (isActive) {
          return
        }
        setDrawMode(IDrawMode.DRAW)
        setWorkingDrawTool({
          type,
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
              type,
              drawColor,
              drawWidth: e,
            })
          }}
          onColorChange={(e) => {
            setDrawColor(e)
            setWorkingDrawTool({
              type,
              drawColor: e,
              drawWidth,
            })
          }}
        />
      ) : null}
    </ToolIcon>
  )
}
