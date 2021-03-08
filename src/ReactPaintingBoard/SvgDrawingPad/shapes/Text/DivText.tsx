import React, { useRef, useMemo, useEffect, useCallback } from 'react'
import classnames from 'classnames'

import { IText, IPoint, IDrawingTool } from '@/ReactPaintingBoard/IType'
import { id, useClickHooks } from '@/ReactPaintingBoard/helper'

import styles from './index.less'

interface ITextProps {
  text: IText
  drawing: boolean
  onDoubleClick: (e: MouseEvent) => void
  onClick: (e: MouseEvent) => void
  onChange: (words: string) => void
}

export function DivText({ text, onChange, drawing, onClick, onDoubleClick }: ITextProps) {
  const divRef = useRef<HTMLDivElement>(null)
  const isEditing = useMemo(() => text.editing, [text])
  const { createClickHandler, createDoubleClickHandler } = useClickHooks()

  const onClickHandler = useMemo(() => createClickHandler(onClick), [createClickHandler, onClick])
  const onDoubleClickHandler = useMemo(() => createDoubleClickHandler(onDoubleClick), [
    createDoubleClickHandler,
    onDoubleClick,
  ])

  const onBlurHandler = useCallback(() => {
    onChange && onChange(divRef.current?.innerText!)
  }, [onChange, divRef])

  useEffect(() => {
    const divElement = divRef.current
    const listener = (event: MouseEvent) => {
      const clickInside = divElement!.contains(event.target as Node)
      if (!clickInside && divElement?.getAttribute('contenteditable') === 'true') {
        onBlurHandler()
      }
    }

    document.addEventListener('click', listener, false)
    return () => {
      document.removeEventListener('click', listener, false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      ref={divRef}
      id={text.id}
      style={{ left: text.x, top: text.y - text.lineWidth, fontSize: text.lineWidth, color: text.lineColor }}
      className={classnames(
        { [styles.textHover]: !drawing && !isEditing, [styles.textAreaBorder]: isEditing },
        styles.textArea
      )}
      contentEditable={isEditing}
      onClick={!isEditing ? onClickHandler : undefined}
      onDoubleClick={!isEditing ? onDoubleClickHandler : undefined}
      onBlur={onBlurHandler}
      dangerouslySetInnerHTML={{ __html: text.words.replace(/\n/g, '<br/>') }}
    />
  )
}

export function createText(point: IPoint, workingDrawTool: IDrawingTool): IText {
  return {
    id: id(),
    lineColor: workingDrawTool.drawColor,
    lineWidth: workingDrawTool.drawWidth,
    type: 'text',
    x: point.x,
    y: point.y,
    words: 'Type words here',
    editing: true,
  }
}
