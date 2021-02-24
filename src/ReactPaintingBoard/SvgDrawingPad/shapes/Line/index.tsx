import React from 'react'
import classnames from 'classnames'

import { ILine } from '@/ReactPaintingBoard/IType'

import styles from './index.less'

interface ILineProps {
  line: ILine
  drawing: boolean
  onClick: (e: React.MouseEvent<SVGPathElement, MouseEvent>) => void
}

export default function Line({ drawing, line, onClick }: ILineProps) {
  const pathData =
    'M ' +
    line.points
      .map((p) => {
        return `${p.x} ${p.y}`
      })
      .join(' L ')

  return (
    <path
      onClick={onClick}
      id={line.id}
      className={classnames(styles.path, { [styles.lineHover]: !drawing })}
      d={pathData}
      stroke={line.lineColor}
      strokeWidth={line.lineWidth}
    />
  )
}
