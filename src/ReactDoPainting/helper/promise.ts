import { ICancelablePromise } from '@/ReactDoPainting/IType'

export function createCancelablePromise(promise: Promise<any>): ICancelablePromise<any> {
  let isCanceled = false

  const wrappedPromise = new Promise<any>((resolve, reject) => {
    promise.then(
      (value) => {
        if (isCanceled) {
          reject({ isCanceled, value })
          return
        }
        resolve(value)
      },
      (error) => {
        reject({ isCanceled, error })
      }
    )
  })

  const cancelablePromise = wrappedPromise as ICancelablePromise<any>

  cancelablePromise.cancel = () => {
    isCanceled = true
  }

  return cancelablePromise
}

export function delay(timeout: number) {
  return new Promise((resolve) => setTimeout(resolve, timeout))
}
