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
import { Select, Tabs } from '@mantine/core';
import {MdOutlineGrid3X3} from "react-icons/md"
import {HiMiniAdjustmentsHorizontal} from "react-icons/hi2"
import { RootState } from '@/store/store';
import { ReplaceChildren, ReplacePool, selectPool } from '@/slices/poolsSlice';
import { setDefaultTopCyl, setDefaultDepthPool, setDefaultHeightCyl, setDefaultHeightPool, setDefaultBottomCyl, setDefaultWidthPool } from '@/slices/defaultsSlice';
interface ISideBarProps {
}

const RightSideBar: React.FC<ISideBarProps> = () => {

  // ------ Defaults ------
    const [Default, setDefault] = useState<string | null>("pool")
    const [Dwidth, setDWidth] = useState<number | null>(16)
    const [Dheight, setDHeight] = useState<number | null>(5)
    const [Ddepth, setDDepth] = useState<number | null>(12)
    const defaults = useAppSelector((state:RootState)=>state.defaults);
    const dispatch = useAppDispatch();

    // fetch & refetch
    
    useEffect(() => {
      // setDWidth()
      switch (Default) {
        case "cyl":
          setDWidth(defaults.cyl.top)
          setDHeight(defaults.cyl.height)
          setDDepth(defaults.cyl.bottom)
          break;
        case "pool":
          setDWidth(defaults.pool.width)
          setDHeight(defaults.pool.height)
          setDDepth(defaults.pool.depth)
          break;
      }
    }, [Default])

    // change values
    useEffect(() => {
      // setDWidth()
      switch (Default) {
        case "cyl":
          dispatch(setDefaultTopCyl(Dwidth))
          dispatch(setDefaultHeightCyl(Dheight))
          dispatch(setDefaultBottomCyl(Ddepth))
          break;
        case "pool":
          dispatch(setDefaultWidthPool(Dwidth))
          dispatch(setDefaultHeightPool(Dheight))
          dispatch(setDefaultDepthPool(Ddepth))
          break;
      }
    }, [Dwidth, Dheight, Ddepth])
    
  // ------------------------  

    const [targetPool, setTargetPool] = useState<number | null>(null)
    const [targetModel, setTargetModel] = useState<{pool:number, model:number} | null>(null)
    const pools = useAppSelector((state:RootState)=>state.pools.pools)  
    //------ target Props -----
    // States
    const [type, setType] = useState<string |null>(null)
    const [position, setPosition] = useState<{x:number,y:number,z:number} | null>(null)
    const [scale, setScale] = useState<{x:number,y:number,z:number} | null>(null)
    const [rotation, setRotation] = useState<{x:number,y:number,z:number} | null>(null)
    const [width, setWidth] = useState<number |null>(null)
    const [height, setHeight] = useState<number |null>(null)
    const [depth, setDepth] = useState<number |null>(null)


        // ----- Fetch props from models ------
        useEffect(() => {
          // fetch pool
          if(targetPool){
            console.log("fetching POOL",targetPool)
            setDepth(pools[targetPool].depth)
            setHeight(pools[targetPool].height)
            setWidth(pools[targetPool].width)
            setScale({x:pools[targetPool].scale[0],y:pools[targetPool].scale[1],z:pools[targetPool].scale[2]})
            setPosition({x:pools[targetPool].position[0],y:pools[targetPool].position[1],z:pools[targetPool].position[2]})
          }
        }, [targetPool])
        useEffect(() => {
          // fetch model
          if(targetModel?.model && targetModel.pool){
            console.log("fetching Model",targetModel)

            setDepth(pools[targetModel.pool].childrens[targetModel.model].depth)
            setHeight(pools[targetModel.pool].childrens[targetModel.model].height)
            setWidth(pools[targetModel.pool].childrens[targetModel.model].width)
            setScale({x:pools[targetModel.pool].childrens[targetModel.model].scale[0],y:pools[targetModel.pool].childrens[targetModel.model].scale[1],z:pools[targetModel.pool].childrens[targetModel.model].scale[2]})
            setPosition({x:pools[targetModel.pool].childrens[targetModel.model].position[0],y:pools[targetModel.pool].childrens[targetModel.model].position[1],z:pools[targetModel.pool].childrens[targetModel.model].position[2]})
          }
        }, [targetModel])
        
        // ----- Update models props ------
        useEffect(() => {
          console.log("targetPool",targetPool)
          console.log("targetModel",targetModel)
          if(targetPool!=null){
            console.log("Update Pool")
            const pool = {...pools[targetPool]}
            // position
            if(pool?.sPosition && position && (pool.sPosition[0]!= position.x || pool.sPosition[2]!= position.y || pool.sPosition[3]!= position.z )){
              const updatedSPosition = [...pool.sPosition]; // Create a copy of the array
              updatedSPosition[0] = position.x;
              updatedSPosition[1] = position.y;
              updatedSPosition[2] = position.z;
              pool.sPosition = updatedSPosition; // Assign the updated array back to pool.sPosition
            console.log("Update updatedSPosition",updatedSPosition)


            }
            // scale
            if(pool?.sScale && scale && (pool.sScale[0]!= scale.x || pool.sScale[2]!= scale.y || pool.sScale[3]!= scale.z )){
              pool.sScale[0]=scale.x
              pool.sScale[1]=scale.y
              pool.sScale[2]=scale.z
            }
            // width
            if(pool?.sWidth && width && pool.sWidth!= width){
              pool.sWidth = width
            }
            // height
            if(pool?.sHeight && height && pool.sHeight!= height){
              pool.sHeight = height
            }
            // depth
            if(pool?.sDepth && depth && pool.sDepth!= depth){
              pool.sDepth = depth
            }
            dispatch(ReplacePool({poolIndex:targetPool, pool:pool}))
          }else if(targetModel?.model!=null && targetModel?.pool!=null){
            console.log("Update Model")

            const model = {...pools[targetModel.pool].childrens[targetModel.model]}
            // position
            if(model?.sPosition && position && (model.sPosition[0]!= position.x || model.sPosition[2]!= position.y || model.sPosition[3]!= position.z )){
              model.sPosition[0]=position.x
              model.sPosition[1]=position.y
              model.sPosition[2]=position.z
            }
            // scale
            if(model?.sScale && scale && (model.sScale[0]!= scale.x || model.sScale[2]!= scale.y || model.sScale[3]!= scale.z )){
              model.sScale[0]=scale.x
              model.sScale[1]=scale.y
              model.sScale[2]=scale.z
            }
            // width
            if(model?.sWidth && width && model.sWidth!= width){
              model.sWidth = width
            }
            // height
            if(model?.sHeight && height && model.sHeight!= height){
              model.sHeight = height
            }
            // depth
            if(model?.sDepth && depth && model.sDepth!= depth){
              model.sDepth = depth
            }
            dispatch(ReplaceChildren({poolIndex:targetPool,modelIndex:targetModel, model:model}))
            
          }
        }, [position,scale,width,height,depth])
        
  return (
    <div className='select-none absolute top-0 right-0 h-screen min-w-[280px] w-[26%] bg-slate-950/90 flex flex-col items-start justify-start p-2 px-4'>
       
       <Tabs variant="pills" defaultValue="defaults" className='w-full'>
        <Tabs.List>
          <Tabs.Tab key={0} className='text-stone-50 hover:text-slate-900' value="scene" icon={<MdOutlineGrid3X3 size="0.8rem" />}>Scene</Tabs.Tab>
          <Tabs.Tab key={1} className='text-stone-50 hover:text-slate-900' value="defaults" icon={<HiMiniAdjustmentsHorizontal size="0.8rem" />}>Defaults</Tabs.Tab>
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
                        <SceneElement index={index} setTargetModel={setTargetModel} targetModel={targetModel} setTargetPool={setTargetPool} targetPool={targetPool} setType={setType} type={pool.poolType} icon={rectangle} title={pool.poolType+" "+index}/>
                        {pool.childrens.map((child, index2)=>{
                          return (<SceneElement index={index} setTargetModel={setTargetModel} targetModel={targetModel} setTargetPool={setTargetPool} targetPool={targetPool} index2={index2} setType={setType} type={child.shapeType} key={index} icon={rectangle} title={child.shapeType+" "+index+index2}/>)
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
              <Properties defaults={Default} width={width} setWidth={setWidth} depth={depth} setDepth={setDepth} height={height} setHeight={setHeight}/>
          </div>
        </div>

        </Tabs.Panel>

        <Tabs.Panel value="defaults" pt="xs">
          <div className='w-full h-full flex-col items-start justify-start gap-y-3 flex'>
          <Select
            label="Select a model type"
            placeholder="Pick a model"
            data={[
              { value: 'pool', label: 'Pool' },
              { value: 'cyl', label: 'Cylinder Pool' },
              // { value: 'Fountain', label: 'Fountain' },
            ]}
            onChange={(e)=>{setDefault(e)}}
          />
           <div className='w-full flex items-center gap-x-6 justify-start'>
              <div className='text-slate-50 text-lg font-medium self-start w-full'>Defaults of:</div>
              <div className='text-lg w-full'>{Default}</div>
          </div>
          <div className='w-full px-3'>
              <Properties defaults={Default} width={Dwidth} setWidth={setDWidth} depth={Ddepth} setDepth={setDDepth} height={Dheight} setHeight={setDHeight}/>
          </div>
          </div>
        </Tabs.Panel>
        </Tabs>
       
    </div>
  );
};

export default RightSideBar;
