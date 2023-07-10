"use client"
import Image, { StaticImageData } from 'next/image';
import * as React from 'react';

interface IconProps extends React.HTMLProps<HTMLDivElement> {
    icon: string,
}

const Icon: React.FC<IconProps> = ({icon,...props}) => {
  return (
    <div {...props} draggable="false" className='cursor-pointer overflow-hidden select-none flex items-center justify-center relative w-12 h-12 rounded-md p-2 active:scale-95 bg-stone-200 transition-transform duration-150 group/hover'>
        {/* <input type='image' alt='ButtonIcon' className='object-cover w-10 h-10' src={icon}/> */}
        <Image fill alt='ButtonIcon' draggable="false" className='object-cover w-10 h-10' src={icon}/>
        <div className='bg-slate-950/0 group-hover/hover:bg-slate-950/10 duration-150 absolute top-0 left-0 w-full h-full transition-all'></div>
    </div>
  ) ;
};

export default Icon;
