import React from 'react'
import SvgDrawingPad from '@/ReactDoPainting/SvgDrawingPad'

import { id, classnames } from '@/ReactDoPainting/helper'
import { PaintingStateProvider } from '@/ReactDoPainting/state'
import Toolbar from '@/ReactDoPainting/Toolbar'

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
