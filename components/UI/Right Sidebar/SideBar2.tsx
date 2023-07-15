"use client"
import React, { Fragment, useEffect, useState } from 'react';
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
import { RootState } from '@/store/store';
interface ISideBarProps {
}

const RightSideBar: React.FC<ISideBarProps> = () => {
    const [targetPool, setTargetPool] = useState<number | null>(null)
    const [targetModel, setTargetModel] = useState<{pool:number, model:number} | null>(null)
    const pools = useAppSelector((state:RootState)=>state.pools.pools)
    
    
    // ----- Select Target ------
    useEffect(() => {
      // fetch pool
      if(targetPool){

      }
    }, [targetPool])
    useEffect(() => {
      // fetch model
      if(targetModel?.model && targetModel.pool){

      }
    }, [targetModel])
    

    //------ target Props -----
    // States
    const [type, setType] = useState<string |null>(null)
    const [position, setPosition] = useState<{x:number,y:number,z:number} | null>(null)
    const [scale, setScale] = useState<{x:number,y:number,z:number} | null>(null)
    const [rotation, setRotation] = useState<{x:number,y:number,z:number} | null>(null)
    const [width, setWidth] = useState<number |null>(null)
    const [height, setHeight] = useState<number |null>(null)
    const [depth, setDepth] = useState<number |null>(null)
  return (
    <div className='select-none absolute top-0 right-0 h-screen min-w-[280px] w-[26%] bg-slate-950/90 flex flex-col items-start justify-start p-2 px-4'>
       
       <Tabs variant="pills" defaultValue="defaults" className='w-full'>
        <Tabs.List>
          <Tabs.Tab className='text-stone-50 hover:text-slate-900' value="scene" icon={<MdOutlineGrid3X3 size="0.8rem" />}>Scene</Tabs.Tab>
          <Tabs.Tab className='text-stone-50 hover:text-slate-900' value="defaults" icon={<HiMiniAdjustmentsHorizontal size="0.8rem" />}>Defaults</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="scene" pt="xs">
        <div className=' flex flex-col items-start justify-start gap-y-3'>
            {/* Scene elements */}
          <div className='flex flex-col items-start justify-start gap-y-2 w-full'>
              <div className='text-slate-50 text-lg font-medium'>Scene elements</div>
              <div className='w-full aspect-[3/2] max-h-60 overflow-auto bg-stone-200 rounded-md scrollbar-thin scrollbar-track-transparent scrollbar-thumb-stone-600 flex flex-col items-start justify-start text-slate-900 gap-y-1 scrollbar-thumb-rounded-full scrollbar-track-rounded-full p-1'>
                  {/* scene elements */}
                  {pools.map((pool, index)=>{
                    return (
                      <Fragment key={index}>
                        <SceneElement index={index} type={"Pool"} icon={rectangle} title={pool.poolType+" "+index}/>
                        {pool.childrens.map((child, index2)=>{
                          return (<SceneElement index={index} index2={index2} type={"Model"} key={index} icon={rectangle} title={child.shapeType+" "+index+index2}/>)
                        })} 
                      </Fragment>
                    )
                  })}
              </div>
          </div>
  
          {/* Details */}
  
          {/* type */}
          <div className='w-full flex items-center gap-x-6 justify-start'>
              <div className='text-slate-50 text-lg font-medium self-start w-full'>Type</div>
              <div className='text-lg w-full'>{type}</div>
          </div>
  
          {/* Transforms */}
          <div className='text-slate-50 text-lg font-medium'>Transforms</div>
          <div className='w-full px-3'>
              <Position position={position} setPosition={setPosition} />
              <Rotation rotation={rotation} setRotation={setRotation} />
              <Scale scale={scale} setScale={setScale}/>
          </div>
  
          {/* Properties and Dimensions */}
          <div className='text-slate-50 text-lg font-medium'>Properties and Dimensions</div>
          <div className='w-full px-3'>
              <Properties width={width} setWidth={setWidth} depth={depth} setDepth={setDepth} height={height} setHeight={setHeight}/>
          </div>
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
