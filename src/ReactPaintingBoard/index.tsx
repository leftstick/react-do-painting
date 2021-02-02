import React from 'react'
import classnames from 'classnames'
import SvgDrawingPad from '@/ReactPaintingBoard/SvgDrawingPad'

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
  return (
    <div style={style} className={classnames(styles.appContainer, className)}>
      <PaintingStateProvider>
        <Toolbar />
        <div className={styles.canvasContainer}>
          <SvgDrawingPad />
        </div>
      </PaintingStateProvider>
    </div>
  )
}
export default ReactPainting
