"use client"
import React from 'react';
import LShape from "@/public/icons/L-Shape.png"
import rectangle from "@/public/icons/rectangle.png"
import box from "@/public/icons/cube.png"
import cyl from "@/public/icons/cylinder.png"
import plus from "@/public/icons/plus.png"
import roundSteps from "@/public/icons/round-steps.png"
import waterblade from "@/public/icons/water-blade.png"
import wallwater from "@/public/icons/waterjet.png"
import infin from "@/public/icons/infinityEdge.png"
import poolWithSteps from "@/public/icons/pool-with-steps.png"
import fountain from "@/public/icons/fountain.png"
import corner from "@/public/icons/corner-steps.png"
import cornerRounded from "@/public/icons/corner-round-steps.png"
import swimjet from "@/public/icons/swim-jet.png"
import inset from "@/public/icons/insetStep.png"
import Icon from './Icon';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setHelper } from '@/slices/helperSlice';
import IconMenu from './IconMenu';
interface ISideBarProps {
}

const SideBar: React.FC<ISideBarProps> = () => {

    const dispatch = useAppDispatch()
    // ------- //
    const OnMouseDownHandler = (event:React.PointerEvent<HTMLDivElement>, type:string)=>{
        console.log("OnMouseDownHandler::",type);
        dispatch(setHelper({mouseDown:true,type:type}))
    }
    // ------- //
  return (
    <div className='select-none absolute top-0 left-0 h-screen bg-slate-950/90 flex flex-col items-center justify-start gap-y-1 p-2'>
       <Icon icon={box.src} onPointerDown={(e)=>OnMouseDownHandler(e,"box")}/>
       <Icon icon={rectangle.src} onPointerDown={(e)=>OnMouseDownHandler(e,"pool")}/>
       <Icon icon={cyl.src} onPointerDown={(e)=>OnMouseDownHandler(e,"cyl")}/>
       <Icon icon={poolWithSteps.src} onPointerDown={(e)=>OnMouseDownHandler(e,"poolWithSteps")}/>
       <Icon icon={LShape.src} onPointerDown={(e)=>OnMouseDownHandler(e,"L-Shape")}/>
       <IconMenu icon={plus.src}>
        <div className='flex items-center justify-start gap-x-1'>
        <Icon icon={cornerRounded.src} onPointerDown={(e)=>OnMouseDownHandler(e,"cornerRounded")}/>
        {/* <Icon icon={roundSteps.src} onPointerDown={(e)=>OnMouseDownHandler(e,"roundSteps")}/> */}
        <Icon icon={corner.src} onPointerDown={(e)=>OnMouseDownHandler(e,"SquareSteps")}/>
        </div>
        <div className='flex items-center justify-start gap-x-1'>
          <Icon icon={fountain.src} onPointerDown={(e)=>OnMouseDownHandler(e,"Fountain")}/>
          <Icon key={1} icon={infin.src} onPointerDown={(e)=>OnMouseDownHandler(e,"InfinityEdge")}/>

        </div>
        <div className='flex items-center justify-start gap-x-1'>
          <Icon icon={swimjet.src} onPointerDown={(e)=>OnMouseDownHandler(e,"SwimJet")}/>
          {/* <Icon icon={corner.src} onPointerDown={(e)=>OnMouseDownHandler(e,"Steps")}/> */}
          <Icon icon={inset.src} onPointerDown={(e)=>OnMouseDownHandler(e,"insetSteps")}/>
        </div>
        <div className='flex items-center justify-start gap-x-1'>
          <Icon icon={waterblade.src} onPointerDown={(e)=>OnMouseDownHandler(e,"Waterblade")}/>
          <Icon icon={wallwater.src} onPointerDown={(e)=>OnMouseDownHandler(e,"WallWaterfall")}/>
        </div>
        <div className='flex items-center justify-start gap-x-1'>
          <Icon icon={roundSteps.src} onPointerDown={(e)=>OnMouseDownHandler(e,"RoundSteps")}/>
          <Icon icon={roundSteps.src} onPointerDown={(e)=>OnMouseDownHandler(e,"Steps")}/>
        </div>
       </IconMenu>
    </div>
  );
};

export default SideBar;
