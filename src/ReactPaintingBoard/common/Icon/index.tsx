import React, { useState } from 'react'
import classnames from 'classnames'

import { capitalize } from '@/ReactPaintingBoard/helper'
import { IToolType } from '@/ReactPaintingBoard/IType'
import '@/assets/css/react-painting-icon.css'
import styles from './index.less'

interface IIconProps {
  type: IToolType
  tooltip?: string
  iconClass:
    | 'icon-cw'
    | 'icon-ccw'
    | 'icon-trash-empty'
    | 'icon-pencil'
    | 'icon-download'
    | 'icon-emo-unhappy'
    | 'icon-check-empty'
    | 'icon-eraser'
    | 'icon-file-word'
    | 'icon-circle-thin'
    | 'icon-circle-empty'
    | 'icon-move'
    | 'icon-columns'
  disabled?: boolean
  active?: boolean
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  children?: any
}

export default function Icon({
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
      <i className={classnames(styles.icon, iconClass)} />
      {!children && (
        <div className={classnames(styles.tooltip, { [styles.hide]: !tipVisible })}>
          {tooltip ? tooltip : capitalize(type)}
        </div>
      )}
      {children}
    </div>
  )
}
