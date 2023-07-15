import Image, { StaticImageData } from 'next/image';
import * as React from 'react';

interface SceneElementProps {
    icon:StaticImageData,
    title:string
}

const SceneElement: React.FunctionComponent<SceneElementProps> = ({icon, title="Pool"}) => {
  return (
    <div className='border-[1px] rounded-md cursor-pointer active:bg-slate-900/20 hover:bg-slate-900/10 bg-transparent transition-all duration-150 border-slate-800 relative w-full h-8 flex items-center justify-start gap-x-2'>
        <Image src={icon.src} width={30} alt={'Icon'} height={100} className='object-scale-down h-full aspect-auto' />
        <div>{title}</div>
    </div>
  );
};

export default SceneElement;
