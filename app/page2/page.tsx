"use client"
import React, { useState } from 'react'

type Props = {}

export default function Page({}: Props) {
    const [val, setval] = useState(0)
  return (
    <div className='flex items-center justify-center gap-y-4 bg-red-200 text-black'> 
        <input type="number" className='w-14' onChange={(e)=>console.log("changed",e.currentTarget.value)} value={val} />
        <div className='w-9 h-9 rounded-lg bg-teal-700 shadow-orange-400 backdrop-blur-sm' onClick={(e)=>setval(val+1)}></div>
    </div>
  )
}