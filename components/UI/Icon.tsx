"use client";
import Image, { StaticImageData } from "next/image";
import * as React from "react";

interface IconProps extends React.HTMLProps<HTMLButtonElement> {
  icon: string;
  ImageClassName?: string;
}

const Icon: React.FC<IconProps> = ({ icon, ImageClassName, ...props }) => {
  return (
    <button
      {...props}
      type="button"
      className="group/hover pointer-events-auto relative flex h-12 w-12 cursor-pointer select-none items-center justify-center overflow-hidden rounded-md bg-stone-200 p-0 transition-transform duration-150 active:scale-95 disabled:pointer-events-none"
    >
      {/* <input type='image' alt='ButtonIcon' className='object-cover w-10 h-10' src={icon}/> */}
      <Image
        height={500}
        width={500}
        alt="ButtonIcon"
        draggable="false"
        className={`mx-auto h-full w-full object-center ${ImageClassName}`}
        src={icon}
      />
      {/* HOVER */}
      <div className="absolute left-0 top-0 h-full w-full bg-slate-950/0 transition-all duration-150 group-hover/hover:bg-slate-950/10"></div>
      {/* DISABLED */}
      <div className="pointer-events-none absolute left-0 top-0 hidden h-full w-full transition-all duration-150 group-disabled/hover:flex group-disabled/hover:bg-stone-800/80"></div>
    </button>
  );
};

export default Icon;
