"use client"
import { CoordinatesContext } from '@/Context/CoordinateContext';
import { selectPointer } from '@/slices/pointerSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
import { CoordinatesContextType, CoordinatesType } from '@/types/coordinates';
import React, { useContext, useEffect, useRef, useState } from 'react';
import PoolHelper from './poolHelper';
import CylinderHelper from './cylinderHelper';
import { selectSnappingPosition } from '@/slices/snappingSlice';
interface HelperProps {
}

const Helper: React.FC<HelperProps> = ({}) => {
  const helper = useAppSelector((state:RootState)=>state.helper)
  // const Coord = useAppSelector(selectSnappingPosition)
  const Coord = useAppSelector(selectPointer)
  const defaults = useAppSelector((state:RootState)=>state.defaults)
  
  switch (helper.type) {
    case "pool":
      return( helper.dragging && <PoolHelper props={{ position: [Coord.x, -defaults.pool.height/2 + .2, Coord.z] }} height={defaults.pool.height} width={defaults.pool.width} depth={defaults.pool.depth}/>)
    case "poolWithSteps":
      return( helper.dragging && <PoolHelper props={{position:[Coord.x, -5/2+.5, Coord.z]}} height={5} width={16} depth={12}/>)
    case "L-Shape":
      return( helper.dragging && <PoolHelper props={{position:[Coord.x, -5/2+.5, Coord.z]}} height={5} width={16} depth={12}/>)
    case "cyl":
      return( helper.dragging && <CylinderHelper props={{position:[Coord.x, -defaults.cyl.height/2+.5, Coord.z]}} bottom={defaults.cyl.bottom} top={defaults.cyl.top} height={defaults.cyl.height} />)
    default:
      //Coord.y+.5
       return( helper.dragging && <mesh position={[Coord.x, Coord.y, Coord.z]}> 
        <boxGeometry args={[4/5,3/5,4/5]}/>
        <meshBasicMaterial color={"green"} transparent opacity={.7}/>
      </mesh>)
      break;
  }
  return(
    helper.dragging && <mesh position={[Coord.x, Coord.y+.5, Coord.z]}>
        <boxGeometry args={[4,3,3]}/>
        <meshBasicMaterial color={"red"} transparent opacity={.7}/>
      </mesh>
  )
};

export default Helper;
