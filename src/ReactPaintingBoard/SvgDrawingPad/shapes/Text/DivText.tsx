import React, { useRef, useEffect } from 'react'

import { IText } from '@/ReactPaintingBoard/IType'

import styles from './index.less'

interface ITextProps {
  text: IText
  onChange: (words: string) => void
}

export default function DivText({ text, onChange }: ITextProps) {
  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    divRef.current && divRef.current.focus()
  }, [])

  return (
    <div
      ref={divRef}
      style={{ left: text.x, top: text.y - text.lineWidth, fontSize: text.lineWidth, color: text.lineColor }}
      className={styles.editingText}
      contentEditable
      onBlur={() => {
        onChange && onChange(divRef.current?.innerText!)
      }}
      dangerouslySetInnerHTML={{ __html: text.words.replace(/\n/g, '<br/>') }}
    />
  )
}
