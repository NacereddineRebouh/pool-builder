"use client"
import { Instances, Instance, useMask } from "@react-three/drei";
import React, { useContext, useState } from "react";
import WallWaterfall from "../Models/WallWaterfall";
import Pool from "../Models/Pool/Pool";
import { CoordinatesContext } from "@/Context/CoordinateContext";
import { CoordinatesContextType } from "@/types/coordinates";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectPointer, setPointer } from "@/slices/pointerSlice";
import { setHelper } from "@/slices/helperSlice";
import { RootState } from "@/store/store";
import { ThreeEvent } from "@react-three/fiber";
import { ShapesType, addPool, addShape } from "@/slices/shapesSlice";
import { setPivotVisibility } from "@/slices/targetSlice";
import { setSnappingPosition } from "@/slices/snappingSlice";

type Props = {};

export default function Ground({}: Props) {
  return (
    <>
      <Grid />
      {/* <Pool/> */}
      {/* <WallWaterfall position={[15,1,0]}/> */}
    </>
  );
}

const Grid = ({ number = 23, lineWidth = 0.026, height = 0.5 }) => {
  const help = useAppSelector((state: RootState)=>state.helper)
  const type = useAppSelector((state: RootState)=>state.helper.type)

  const dispatch = useAppDispatch() 
  const coords =  useAppSelector((state: RootState)=>state.pointer)
  const pools =  useAppSelector((state: RootState)=>state.shapes.pools)
  const stencil = useMask(1, true)

  // ------- //
  const poolwidth=16
  const poolheight=5
  const pooldepth=12
  const boxWidth = 3
  const boxHeight = poolheight
  const boxDepth = 4

  const swimJetBoxWidth = 3/3
  const swimJetBoxHeight = poolheight/3
  const swimJetBoxDepth = 4/3

  const infinityEdgeBoxWidth = 1
  const infinityEdgeBoxHeight = 1
  const infinityEdgeBoxDepth = pooldepth

  const waterFallBoxWidth = 3
  const waterFallBoxHeight = 2
  const waterFallBoxDepth = 2
  const [stairs, setstairs] = useState([
    {position:[-poolwidth/2+boxWidth/2,-poolheight+boxHeight/2,0], used:false},//left
    {position:[poolwidth/2-boxWidth/2,-poolheight+boxHeight/2,0], used:false},//right
    {position:[0,-poolheight+boxHeight/2,-pooldepth/2+boxDepth/2], used:false},//top
    {position:[0,-poolheight+boxHeight/2,pooldepth/2-boxDepth/2], used:false},   //bottom
  ])
  const [SnappingPosition, setSnappingPosition] = useState<{x: number, y: number, z: number}|null>({x: 0, y: 0, z: 0})
  const [ClosestIndex, setClosestIndex] = useState(0)
  // ------- //
  const OnPointerMoveHandler = (e:ThreeEvent<PointerEvent>)=>{
    // console.log("OnMouseMoveHandler::",help.mouseDown," drag ::",help.dragging);
    let pointer = {x:e.point.x, y:e.point.y, z:e.point.z}
    
    if(help.mouseDown){
      dispatch(setHelper({dragging:true}))
      if(type!="pool" && type!="cyl" && type!="poolWithSteps" && type!="L-Shape"){

        // find closest pool
        let dist = Infinity
        let closestPool:ShapesType= pools[0];
        pools?.map((pool, index)=>{
          const temp =Math.sqrt(e.point.x * pool.position[0] + e.point.y * pool.position[1] + e.point.z * pool.position[2])
          if(temp<dist){
            dist=temp
            closestPool=pool
          }})
        
        // find closest snap area according to type
        if(closestPool)
        switch (true) {
          case type==="SquareSteps" || type==="Steps":
            const available = stairs.filter(stair => stair.used===false);
            if(available.length>0){
              let closest = available[0]
              let newdist = Math.sqrt(
                Math.pow(e.point.x - (closestPool.position[0] + available[0].position[0]), 2) +
                Math.pow(e.point.y - (closestPool.position[1] + available[0].position[1]), 2) +
                Math.pow(e.point.z - (closestPool.position[2] + available[0].position[2]), 2)
              );
              available.map((stair, index) => {
                const temp = Math.sqrt(
                  Math.pow(e.point.x - (closestPool.position[0] + stair.position[0]), 2) +
                  Math.pow(e.point.y - (closestPool.position[1] + stair.position[1]), 2) +
                  Math.pow(e.point.z - (closestPool.position[2] + stair.position[2]), 2)
                );
                console.log("set:::", index, temp);
                if (temp < newdist) {
                  newdist = temp;
                  closest = stair;
                  
                  setClosestIndex(index)
                }
              });
              pointer  = {
                x: closestPool.position[0] + closest.position[0],
                y: closestPool.position[1] + closest.position[1],
                z: closestPool.position[2] + closest.position[2],
              };
              setSnappingPosition(pointer)         
            }
              break;
          case type==="SwimJet":
            
            break;
          case type==="InfinityEdge":
            
            break;
          case type==="Fountain" || type === " WallWaterfall" || type === "Waterblade":
            
            break;
          case type==="cornerRounded":
            
            break;
          case type==="insetSteps" || type==="beachEntry":
            
            break;
        }
    }
    }else{
      dispatch(setHelper({dragging:false}))
    }
    dispatch(setPointer(pointer))
  }
  const OnPointerUpHandler = (e:ThreeEvent<PointerEvent>)=>{
    console.log("OnMouseUpHandler::",help.mouseDown," drag ::",help.dragging);
    if(help.mouseDown){
      dispatch(setHelper({mouseDown:false, dragging:false}))
      switch (type) {
        case "pool":
          dispatch(addPool({shapeType:type, position:[coords.x,coords.y,coords.z], scale:[1,1,1]}))
          break;
        case "poolWithSteps":
          dispatch(addPool({shapeType:type, position:[e.point.x,e.point.y,e.point.z], scale:[1,1,1]}))
          break;
        case "L-Shape":
          dispatch(addPool({shapeType:type, position:[e.point.x,e.point.y,e.point.z], scale:[1,1,1]}))
          break;
        case "cyl":
          dispatch(addPool({shapeType:type, position:[e.point.x,e.point.y,e.point.z], scale:[1,1,1]}))
          break;
        default:
          if(SnappingPosition){
            const temp = stairs
            temp[ClosestIndex].used = true;
            setstairs(temp)
            dispatch(addShape({shapeType:type, position:[SnappingPosition.x,SnappingPosition.y-poolheight/2,SnappingPosition.z], scale:[1,1,1]}))
          }
            break;
      }
    }
  }
  // ------- //


  {/* Floor */}
  return (

    <mesh onClick={(e)=>dispatch(setPivotVisibility(false))} rotation={[-Math.PI / 2, 0, 0]} renderOrder={1} position={[0, 0, 0]} onPointerUp={(e)=>OnPointerUpHandler(e)} onPointerMove={(e)=>OnPointerMoveHandler(e)}>
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial {...stencil} color={"#fff"}/>

    </mesh>
)};
