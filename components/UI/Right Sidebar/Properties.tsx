"use client"
import * as React from 'react';

interface IPropertiesProps {
}

const Properties: React.FunctionComponent<IPropertiesProps> = (props) => {
  return (
    <div className='w-full flex flex-col items-start justify-start'>
        {/* Width */}
        <div className='w-full flex items-center gap-x-6 justify-start'>
            <div className='text-slate-50 text-lg self-start w-full'>Width</div>
            <div className='flex items-center gap-x-2 justify-start w-full'>
                <input type='number' name="width" className='max-w-[35px] bg-transparent text-slate-50' step={0.1} defaultValue={0}/>
            </div>
        </div>
        {/* Height */}
        <div className='w-full flex items-center gap-x-6 justify-start'>
            <div className='text-slate-50 text-lg self-start w-full'>Height</div>
            <div className='flex items-center gap-x-2 justify-start w-full'>
                <input type='number' name="height" className='max-w-[35px] bg-transparent text-slate-50' step={0.1} defaultValue={0}/>
            </div>
       </div>
        {/* Depth */}
        <div className='w-full flex items-center gap-x-6 justify-start'>
            <div className='text-slate-50 text-lg self-start w-full'>Depth</div>
            <div className='flex items-center gap-x-2 justify-start w-full'>
                <input type='number' name="depth" className='max-w-[35px] bg-transparent text-slate-50' step={0.1} defaultValue={0}/>
            </div>
        </div>
    </div>
  );
};

export default Properties;
