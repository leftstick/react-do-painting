import React, { useCallback, useRef } from 'react'
import classnames from 'classnames'

import { ICancelablePromise, IText } from '@/ReactDoPainting/IType'
import { id, createCancelablePromise, delay } from '@/ReactDoPainting/helper'

import styles from './index.less'

interface ITextProps {
  text: IText
  drawing: boolean
  onDoubleClick: (e: MouseEvent) => void
  onClick: (e: MouseEvent) => void
}

export function SvgText({ drawing, text, onClick, onDoubleClick }: ITextProps) {
  const stateRef = useRef<ICancelablePromise<any>[]>([])

  const addToPendingPromises = useCallback(
    (promise: ICancelablePromise<any>) => {
      stateRef.current.push(promise)
    },
    [stateRef]
  )

  const removeFromPendingPromises = useCallback(
    (promise: ICancelablePromise<any>) => {
      stateRef.current = stateRef.current.filter((p) => p !== promise)
    },
    [stateRef]
  )

  const clearPendingPromises = useCallback(() => {
    stateRef.current.forEach((p) => {
      p.cancel()
    })
    stateRef.current = []
  }, [stateRef])

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent<SVGTextElement, MouseEvent>) => {
      clearPendingPromises()
      onDoubleClick(e.nativeEvent)
    },
    [clearPendingPromises, onDoubleClick]
  )

  const handleClick = useCallback(
    (e: React.MouseEvent<SVGTextElement, MouseEvent>) => {
      // create the cancelable promise and add it to
      // the pending promises queue
      const waitForClick = createCancelablePromise(delay(200))
      addToPendingPromises(waitForClick)
      const event = e.nativeEvent

      waitForClick
        .then(() => {
          // if the promise wasn't cancelled, we execute
          // the callback and remove it from the queue
          // removeFromPendingPromises(waitForClick)
          onClick(event)
        })
        .catch((errorInfo) => {
          // rethrow the error if the promise wasn't
          // rejected because of a cancelation
          removeFromPendingPromises(waitForClick)
          if (!errorInfo.isCanceled) {
            throw errorInfo.error
          }
        })
    },
    [addToPendingPromises, removeFromPendingPromises, onClick]
  )

  const lines = text.words.split('\n')

  return (
    <text
      id={text.id}
      x={text.x}
      y={text.y}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      style={{
        fontSize: text.lineWidth,
        fill: text.lineColor,
      }}
      className={classnames({ [styles.textHover]: !drawing })}
    >
      {lines.map((line, index) => {
        return (
          <tspan key={id()} x={text.x} y={text.y + index * text.lineWidth} style={{ userSelect: 'none' }}>
            {line}
          </tspan>
        )
      })}
    </text>
  )
}
