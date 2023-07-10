"use client"
import { selectHelper } from '@/slices/helperSlice';
import { useAppSelector } from '@/store/hooks';
import Image, { StaticImageData } from 'next/image';
import * as React from 'react';

interface IconProps extends React.HTMLProps<HTMLDivElement> {
    icon: string,
    children:React.ReactNode
}

const IconMenu: React.FC<IconProps> = ({children, icon,...props}) => {
    const [open, setOpen] = React.useState(false)
    const helper = useAppSelector(selectHelper)
  return (
    <>
      <div {...props} draggable="false" onClick={()=>setOpen(!open)} className='cursor-pointer scollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent scrollbar-thumb-rounded-full select-none flex items-center justify-center relative w-11 h-11 rounded-md p-2 group active:scale-95 bg-stone-200 transition-transform duration-150'>
          {/* <input type='image' alt='ButtonIcon' className='object-cover w-10 h-10' src={icon}/> */}
          <Image fill alt='ButtonIcon' draggable="false" className='object-cover w-10 h-10' src={icon}/>
          {!helper.mouseDown && !helper.dragging && open && <div className='absolute max-h-[400px] scollbar flex flex-col items-center justify-start left-[120%] bg-slate-950/90 rounded-md p-2 gap-y-1 group-active:scale-105 transition-transform duration-150'>
            {children}
        </div>}
      </div>
      {/* Sub Second Menu */}
      
    </>
  ) ;
};

export default IconMenu;
