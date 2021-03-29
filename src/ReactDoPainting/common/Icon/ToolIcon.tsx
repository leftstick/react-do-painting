import React, { useState } from 'react'

import { capitalize, classnames } from '@/ReactDoPainting/helper'
import { IToolType } from '@/ReactDoPainting/IType'
import { BaseIcon } from './BaseIcon'

import styles from './index.less'

export type IToolbarIconClassType =
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

interface IIconProps {
  type: IToolType
  tooltip?: string
  iconClass: IToolbarIconClassType
  disabled?: boolean
  active?: boolean
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  children?: any
}

export function ToolIcon({
  type,
  disabled,
  active,
  tooltip,
  iconClass,
  onClick,
  children,
  onMouseEnter,
  onMouseLeave,
}: IIconProps) {
  const [tipVisible, setTipVisible] = useState(false)
  console.log('classnames(styles.icon)', styles.icon)
  return (
    <div
      onMouseEnter={() => {
        setTipVisible(true)
        onMouseEnter && onMouseEnter()
      }}
      onMouseLeave={() => {
        setTipVisible(false)
        onMouseLeave && onMouseLeave()
      }}
      className={classnames(styles.iconBlock, { [styles.disabled]: disabled, [styles.active]: !disabled && active })}
      onClick={(e) => {
        if (!disabled) {
          onClick && onClick(e)
        }
      }}
    >
      <BaseIcon type={iconClass} className={classnames(styles.icon)} />
      {!children && (
        <div className={classnames(styles.tooltip, { [styles.hide]: !tipVisible })}>
          {tooltip ? tooltip : capitalize(type)}
        </div>
      )}
      {children}
    </div>
  )
}
