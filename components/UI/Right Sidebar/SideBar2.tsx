"use client"
import React from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setHelper } from '@/slices/helperSlice';
import rectangle from "@/public/icons/rectangle.png"
import Image from 'next/image';
import SceneElement from '../sceneElement';
import Position from './Position';
import Rotation from './Rotation';
import Scale from './Scale';
import Properties from './Properties';
import { Tabs } from '@mantine/core';
import {MdOutlineGrid3X3} from "react-icons/md"
import {HiMiniAdjustmentsHorizontal} from "react-icons/hi2"
interface ISideBarProps {
}

const RightSideBar: React.FC<ISideBarProps> = () => {

    const dispatch = useAppDispatch()
    // --- Mouse Events ---- //
    // const OnMouseDownHandler = (event:React.PointerEvent<HTMLDivElement>, type:string)=>{
    //     console.log("OnMouseDownHandler::",type);
    //     dispatch(setHelper({mouseDown:true,type:type}))
    // }
    // ------- //
  return (
    <div className='select-none absolute top-0 right-0 h-screen min-w-[280px] w-[26%] bg-slate-950/90 flex flex-col items-start justify-start gap-y-3 p-2 px-4'>
       
       <Tabs variant="pills" defaultValue="defaults">
        <Tabs.List>
          <Tabs.Tab value="scene" icon={<MdOutlineGrid3X3 size="0.8rem" />}>Scene</Tabs.Tab>
          <Tabs.Tab value="defaults" icon={<HiMiniAdjustmentsHorizontal size="0.8rem" />}>Defaults</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="scene" pt="xs">
          {/* Scene elements */}
        <div className='flex flex-col items-start justify-start gap-y-2 w-full'>
            <div className='text-slate-50 text-lg font-medium'>Scene elements</div>
            <div className='w-full aspect-[3/2] max-h-60 overflow-auto bg-stone-200 rounded-md scrollbar-thin scrollbar-track-transparent scrollbar-thumb-stone-600 flex flex-col items-start justify-start text-slate-900 gap-y-1 scrollbar-thumb-rounded-full scrollbar-track-rounded-full p-1'>
                {/* scene elements */}
               <SceneElement icon={rectangle} title={'Pool'}/> 
            </div>
        </div>

        {/* Details */}

        {/* type */}
        <div className='w-full flex items-center gap-x-6 justify-start'>
            <div className='text-slate-50 text-lg font-medium self-start w-full'>Type</div>
            <div className='text-lg w-full' >Pool</div>
        </div>

        {/* Transforms */}
        <div className='text-slate-50 text-lg font-medium'>Transforms</div>
        <div className='w-full px-3'>
            <Position/>
            <Rotation/>
            <Scale/>
        </div>

        {/* Properties and Dimensions */}
        <div className='text-slate-50 text-lg font-medium'>Properties and Dimensions</div>
        <div className='w-full px-3'>
            <Properties/>
        </div>

        </Tabs.Panel>

        <Tabs.Panel value="defaults" pt="xs">
          Messages tab content
        </Tabs.Panel>
        </Tabs>
       
    </div>
  );
};

export default RightSideBar;
