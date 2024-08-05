import React, { ReactNode } from 'react'
import { text } from 'stream/consumers'

type Props = {
    children: ReactNode,
    onClick: () => void,
    size?: 'small' | 'large'
}

export default function PrimaryButton({children, onClick, size}: Props) {
  return (
    <div
      className={`${size === 'small' ? 'text-sm' : 'text-xl'} ${
        size === 'small' ? ' px-4 py-2' : ' px-8 py-10'
      } bg-amber-700  hover:bg-amber-600 rounded-md cursor-pointer`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}