import * as React from 'react';

interface IScaleProps {
  scale:{
    x: number;
    y: number;
    z: number;}|null;
  setScale:React.Dispatch<React.SetStateAction<{ x: number; y: number; z: number;} | null>>
}

const Scale: React.FunctionComponent<IScaleProps> = ({scale, setScale}) => {
  return ( 
    <div className='w-full flex items-center gap-x-6 justify-start'>
        <div className='text-slate-50 text-lg self-start w-full'>Scale</div>
        <div className='flex items-center gap-x-2 justify-start w-full'>
            <input type='number' className='max-w-[35px] bg-transparent text-slate-50' step={0.1} defaultValue={scale?.x && 1}/>
            <input type='number' className='max-w-[35px] bg-transparent text-slate-50' step={0.1} defaultValue={scale?.y && 1}/>
            <input type='number' className='max-w-[35px] bg-transparent text-slate-50' step={0.1} defaultValue={scale?.z && 1}/>
        </div>
    </div>
   );
};

export default Scale;
