import Image, { StaticImageData } from 'next/image';
import * as React from 'react';
import rectangle from "@/public/icons/rectangle.png"
import { off } from 'process';

interface SceneElementProps {
    icon?:StaticImageData,
    title:string,
    type:string,
    index:number,
    index2?:number,
    setType:React.Dispatch<React.SetStateAction<string | null>>,
    targetPool: number | null,
    setTargetPool:React.Dispatch<React.SetStateAction<number | null>>,
    targetModel: {pool:number, model:number} | null,
    setTargetModel:React.Dispatch<React.SetStateAction<{pool:number, model:number} | null>>,
}

const SceneElement: React.FunctionComponent<SceneElementProps> = ({icon, type, setTargetModel, targetModel, targetPool, setTargetPool, setType, index, index2, title="Pool"}) => {
  return (
    <div onClick={(e)=>{
      e.stopPropagation()
      setType(type.toLocaleUpperCase())
      console.log(type)
      if(type==="pool" || type==="poolWithSteps" || type==="L-Shape" || type==="cyl"){
        setTargetModel(null)
        if(targetPool!=index){
          setTargetPool(index)
        }
      }else{
        if((targetModel?.model!=index2 || targetModel?.pool!= index)){
          setTargetPool(null)
          // Model changed && !pool changed
          if(targetModel?.pool && targetModel?.model && index2 && targetModel.model!=index2) 
             setTargetModel({pool:targetModel.pool, model:index2})
          // Model changed && pool changed
          if(targetModel?.pool && targetModel?.model && index2 && index && targetModel.model!=index2) 
             setTargetModel({pool:index, model:index2})
        }
      }
    }} className='border-[1px] rounded-md cursor-pointer active:bg-slate-900/20 hover:bg-slate-900/10 bg-transparent transition-all duration-150 border-slate-800 relative w-full h-8 flex items-center justify-start gap-x-2'>
        <Image src={rectangle.src} width={30} alt={'Icon'} height={100} className='object-scale-down h-full aspect-auto' />
        <div>{title}</div>
    </div>
  );
};

export default SceneElement;
