import React from 'react'
import classnames from 'classnames'
import SvgDrawingPad from '@/ReactPaintingBoard/SvgDrawingPad'

import { id } from '@/ReactPaintingBoard/helper'
import { PaintingStateProvider } from '@/ReactPaintingBoard/state'
import Toolbar from '@/ReactPaintingBoard/Toolbar'

import styles from './index.less'

interface IReactPaintingProps {
  /**
   * @description       组件额外的 CSS style
   */
  style?: React.CSSProperties
  /**
   * @description       组件额外的 CSS className
   */
  className?: string
}

const ReactPainting: React.FC<IReactPaintingProps> = ({ style, className }) => {
  const padId = id()
  return (
    <div style={style} className={classnames(styles.appContainer, className)}>
      <PaintingStateProvider>
        <Toolbar padId={padId} />
        <div className={styles.canvasContainer}>
          <SvgDrawingPad id={padId} />
        </div>
      </PaintingStateProvider>
    </div>
  )
}
export default ReactPainting
