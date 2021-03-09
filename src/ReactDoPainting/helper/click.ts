import { useRef, useCallback } from 'react'

import { ICancelablePromise } from '@/ReactDoPainting/IType'
import { createCancelablePromise, delay } from './promise'

interface IOnClickHandler {
  (e: MouseEvent): void
}

export function useClickHooks() {
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

  const createDoubleClickHandler = useCallback(
    (onDoubleClick: IOnClickHandler) => {
      return (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        clearPendingPromises()
        onDoubleClick(e.nativeEvent)
      }
    },
    [clearPendingPromises]
  )

  const createClickHandler = useCallback(
    (onClick: IOnClickHandler) => {
      return (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
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
      }
    },
    [addToPendingPromises, removeFromPendingPromises]
  )

  return {
    createClickHandler,
    createDoubleClickHandler,
  }
}
