import React, { CSSProperties } from 'react'

import { ReactComponent as CancelCircledSvg } from '../../../assets/icons/cancel-circled.svg'
import { ReactComponent as CcwSvg } from '../../../assets/icons/ccw.svg'
import { ReactComponent as CheckEmptySvg } from '../../../assets/icons/check-empty.svg'
import { ReactComponent as CircleEmptySvg } from '../../../assets/icons/circle-empty.svg'
import { ReactComponent as CircleThinSvg } from '../../../assets/icons/circle-thin.svg'
import { ReactComponent as ColumnsSvg } from '../../../assets/icons/columns.svg'
import { ReactComponent as CwSvg } from '../../../assets/icons/cw.svg'
import { ReactComponent as DownloadSvg } from '../../../assets/icons/download.svg'
import { ReactComponent as EmoUnhappySvg } from '../../../assets/icons/emo-unhappy.svg'
import { ReactComponent as EraserSvg } from '../../../assets/icons/eraser.svg'
import { ReactComponent as FileWordSvg } from '../../../assets/icons/file-word.svg'
import { ReactComponent as LevelDownSvg } from '../../../assets/icons/level-down.svg'
import { ReactComponent as MoveSvg } from '../../../assets/icons/move.svg'
import { ReactComponent as PencilSvg } from '../../../assets/icons/pencil.svg'
import { ReactComponent as TrashEmptySvg } from '../../../assets/icons/trash-empty.svg'

export type IIconClassType =
  | 'cancel-circled'
  | 'cw'
  | 'ccw'
  | 'trash-empty'
  | 'pencil'
  | 'download'
  | 'emo-unhappy'
  | 'check-empty'
  | 'eraser'
  | 'file-word'
  | 'circle-thin'
  | 'circle-empty'
  | 'move'
  | 'columns'
  | 'level-down'

interface IBaseIconProps {
  type: IIconClassType
  style?: CSSProperties
  className?: string
  dataType?: string
  onClick?: React.MouseEventHandler<SVGSVGElement>
}

export function BaseIcon({ type, style, className, onClick, dataType }: IBaseIconProps) {
  console.log('className', className)
  let Svg = null
  if (type === 'cancel-circled') {
    Svg = CancelCircledSvg
  }
  if (type === 'ccw') {
    Svg = CcwSvg
  }
  if (type === 'check-empty') {
    Svg = CheckEmptySvg
  }
  if (type === 'circle-empty') {
    Svg = CircleEmptySvg
  }
  if (type === 'circle-thin') {
    Svg = CircleThinSvg
  }
  if (type === 'columns') {
    Svg = ColumnsSvg
  }
  if (type === 'cw') {
    Svg = CwSvg
  }
  if (type === 'download') {
    Svg = DownloadSvg
  }
  if (type === 'emo-unhappy') {
    Svg = EmoUnhappySvg
  }
  if (type === 'eraser') {
    Svg = EraserSvg
  }
  if (type === 'file-word') {
    Svg = FileWordSvg
  }
  if (type === 'level-down') {
    Svg = LevelDownSvg
  }
  if (type === 'move') {
    Svg = MoveSvg
  }
  if (type === 'pencil') {
    Svg = PencilSvg
  }
  if (type === 'trash-empty') {
    Svg = TrashEmptySvg
  }

  if (!Svg) {
    throw new Error('unknown icon type')
  }

  return <Svg className={className} style={style} onClick={onClick} data-type={dataType} />
}
