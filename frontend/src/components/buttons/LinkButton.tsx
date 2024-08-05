"use client";
import React, { ReactNode } from 'react'

// type Props = {}

const LinkButton = ({children, onClick} : {children: ReactNode , onClick :() => void}) => {
  return (
    <div onClick={onClick} className=" px-2 py-2 cursor-pointer mr-2 hover:bg-slate-200 ">
      {children}
    </div>
  )
}

export default LinkButton