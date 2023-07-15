import * as React from 'react';

interface IScaleProps {
}

const Scale: React.FunctionComponent<IScaleProps> = (props) => {
  return ( 
    <div className='w-full flex items-center gap-x-6 justify-start'>
        <div className='text-slate-50 text-lg self-start w-full'>Scale</div>
        <div className='flex items-center gap-x-2 justify-start w-full'>
            <input type='number' className='max-w-[35px] bg-transparent text-slate-50' step={0.1} defaultValue={0}/>
            <input type='number' className='max-w-[35px] bg-transparent text-slate-50' step={0.1} defaultValue={0}/>
            <input type='number' className='max-w-[35px] bg-transparent text-slate-50' step={0.1} defaultValue={0}/>
        </div>
    </div>
   );
};

export default Scale;
