import React from 'react'
import classnames from 'classnames'

import { IEllipse } from '@/ReactPaintingBoard/IType'

import styles from './index.less'

interface IEllipseProps {
  ellipse: IEllipse
  drawing: boolean
  onClick: (e: React.MouseEvent<SVGEllipseElement, MouseEvent>) => void
}

export default function Rect({ drawing, ellipse, onClick }: IEllipseProps) {
  return (
    <ellipse
      onClick={onClick}
      id={ellipse.id}
      cx={ellipse.cx}
      cy={ellipse.cy}
      rx={ellipse.rx}
      ry={ellipse.ry}
      style={{
        fill: 'none',
        stroke: ellipse.lineColor,
        strokeWidth: ellipse.lineWidth,
      }}
      className={classnames({ [styles.ellipseHover]: !drawing })}
    />
  )
}
