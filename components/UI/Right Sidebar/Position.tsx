import * as React from 'react';

interface IPositionProps {
  position:{
    x: number;
    y: number;
    z: number;}|null;
  setPosition:React.Dispatch<React.SetStateAction<{ x: number; y: number; z: number;} | null>>
}

const Position: React.FunctionComponent<IPositionProps> = ({position, setPosition}) => {
  return ( 
    <div className='w-full flex items-center gap-x-6 justify-start'>
        <div className='text-slate-50 text-lg self-start w-full'>Position</div>
        <div className='flex items-center gap-x-2 justify-start w-full'>
            <input type='number' className='max-w-[35px] bg-transparent text-slate-50' step={0.1} defaultValue={0}/>
            <input type='number' className='max-w-[35px] bg-transparent text-slate-50' step={0.1} defaultValue={0}/>
            <input type='number' className='max-w-[35px] bg-transparent text-slate-50' step={0.1} defaultValue={0}/>
        </div>
    </div>
   );
};

export default Position;
