"use client"
import * as React from 'react';

interface IPropertiesProps {
    width:number|null;
    setWidth:React.Dispatch<React.SetStateAction<number | null>>;
    height:number|null;
    setHeight:React.Dispatch<React.SetStateAction<number | null>>;
    depth:number|null;
    setDepth:React.Dispatch<React.SetStateAction<number | null>>;
    defaults:string|null;
}

const Properties: React.FunctionComponent<IPropertiesProps> = ({defaults,width, setWidth, height, setHeight, depth, setDepth}) => {
  return (
    <div className='w-full flex flex-col items-start justify-start'>
        {/* Width */}
        <div className='w-full flex items-center gap-x-6 justify-start'>
            <div className='text-slate-50 text-lg self-start w-full'>{defaults==="cyl"?"Top":"Width"}</div>
            <div className='flex items-center gap-x-2 justify-start w-full'>
                <input type='number' name="width" onChange={(e)=>setWidth(e.currentTarget.value as unknown as number)} className='max-w-[80px] bg-transparent text-slate-50' step={0.1} value={width?width:0}/>
            </div>
        </div>
        {/* Height */}
        <div className='w-full flex items-center gap-x-6 justify-start'>
            <div className='text-slate-50 text-lg self-start w-full'>Height</div>
            <div className='flex items-center gap-x-2 justify-start w-full'>
                <input type='number' name="height" onChange={(e)=>setHeight(e.currentTarget.value as unknown as number)} className='max-w-[80px] bg-transparent text-slate-50' step={0.1} value={height?height:0}/>
            </div>
       </div>
        {/* Depth */}
        <div className='w-full flex items-center gap-x-6 justify-start'>
            <div className='text-slate-50 text-lg self-start w-full'>{defaults==="cyl"?"Bottom":"Depth"}</div>
            <div className='flex items-center gap-x-2 justify-start w-full'>
                <input type='number' onChange={(e)=>setDepth(e.currentTarget.value as unknown as number)} name="depth" className='max-w-[80px] bg-transparent text-slate-50' step={0.1} value={depth?depth:0}/>
            </div>
        </div>
    </div>
  );
};

export default Properties;
