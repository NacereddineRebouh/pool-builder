"use client"
import { Instances, Instance, useMask } from "@react-three/drei";
import React, { useContext, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectPointer, setPointer } from "@/slices/pointerSlice";
import { setHelper } from "@/slices/helperSlice";
import { RootState } from "@/store/store";
import { ThreeEvent } from "@react-three/fiber";
import { addPool as addNewPool, addChildren, PoolType } from "@/slices/poolsSlice";
import { setPivotVisibility } from "@/slices/targetSlice";
enum sides{
  Top = "Top",
  Bottom= "Bottom",
  Left = "Left",
  Right = "Right",
}
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
  const visibility = useAppSelector((state: RootState)=>state.target.pivotVisibility)

  const dispatch = useAppDispatch() 
  const coords =  useAppSelector((state: RootState)=>state.pointer)
  const pools =  useAppSelector((state: RootState)=>state.shapes.pools)
  const Pools =  useAppSelector((state: RootState)=>state.pools.pools)
  const stencil = useMask(1, true)

  // ------- //
  const poolwidth=16
  const poolheight=5
  const pooldepth=12
  const boxWidth = 3
  const boxHeight = poolheight
  const boxDepth = 4
  
  const cornerHeight = 4

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
  const [swimJet, setswimJet] = useState([
    {position:[-poolwidth/2+swimJetBoxWidth/2,-poolheight/2+swimJetBoxHeight/2,0], used:false},//left
    {position:[poolwidth/2-swimJetBoxWidth/2,-poolheight/2+swimJetBoxHeight/2,0], used:false},//right
    {position:[0,-poolheight/2+swimJetBoxHeight/2,-pooldepth/2+swimJetBoxWidth/2], used:false},//top
    {position:[0,-poolheight/2+swimJetBoxHeight/2,pooldepth/2-swimJetBoxWidth/2], used:false},   //bottom
  ])
  const [infinityEdge, setinfinityEdge] = useState([
    {position:[-poolwidth/2-infinityEdgeBoxWidth,infinityEdgeBoxHeight/2,0], used:false},//left
    {position:[poolwidth/2+infinityEdgeBoxWidth,infinityEdgeBoxHeight/2,0], used:false},//right
    {position:[0,infinityEdgeBoxHeight/2,-pooldepth/2-infinityEdgeBoxWidth], used:false},//top
    {position:[0,infinityEdgeBoxHeight/2,pooldepth/2+infinityEdgeBoxWidth], used:false},   //bottom
  ])
  const [fountain, setfountain] = useState([
    {position:[-poolwidth/2-0,waterFallBoxHeight/2,0], used:false},//left
    {position:[poolwidth/2+0,waterFallBoxHeight/2,0], used:false},//right
    {position:[0,waterFallBoxHeight/2,-pooldepth/2-0], used:false},//top
    {position:[0,waterFallBoxHeight/2,pooldepth/2+0], used:false},   //bottom
  ])
  const [Corner, setCorner] = useState([
    {position:[-poolwidth/2+3/2, -height+4/2, -pooldepth/2+3/2], used:false},//left
    {position:[poolwidth/2-3/2,-height+4/2,-pooldepth/2+3/2], used:false},//right
    {position:[-poolwidth/2+3/2,-height+4/2,pooldepth/2-3/2], used:false},//top
    {position:[poolwidth/2-3/2,-height+4/2,pooldepth/2-3/2], used:false},   //bottom
  ])
  const [beach, setbeach] = useState([
    {position:[-poolwidth/2-2,2/2,0], used:false},//left
    {position:[poolwidth/2+2,2/2,0], used:false},//right
    {position:[0,2/2,-pooldepth/2-2], used:false},//top
    {position:[0,2/2,pooldepth/2+2], used:false},   //bottom
  ])

  const [SnappingPosition, setSnappingPosition] = useState<{x: number, y: number, z: number}|null>(null)
  const [ClosestIndex, setClosestIndex] = useState(0)
  const [ClosestPoolIndex, setClosestPoolIndex] = useState(0)
  // ------- //
  const OnPointerMoveHandler = (e:ThreeEvent<PointerEvent>)=>{
    // console.log("OnMouseMoveHandler::",help.mouseDown," drag ::",help.dragging);
    let pointer = {x:e.point.x, y:e.point.y, z:e.point.z}
    
    if(help.mouseDown){
      dispatch(setHelper({dragging:true}))
      if(type!="pool" && type!="cyl" && type!="poolWithSteps" && type!="L-Shape"){

        // find closest pool
        let dist = Infinity
        let closestPool:PoolType= Pools[0];
        Pools?.map((pool, index)=>{
          const temp = Math.sqrt(
            Math.pow(e.point.x - pool.position[0], 2) +
            Math.pow(e.point.y - pool.position[1], 2) +
            Math.pow(e.point.z - pool.position[2], 2)
          );
          const temp_ =Math.sqrt(e.point.x * pool.position[0] + e.point.y * pool.position[1] + e.point.z * pool.position[2])
          if(temp<dist){
            dist=temp
            closestPool=pool
            setClosestPoolIndex(index)
          }})
          console.log(ClosestPoolIndex)
        // let closestPool:ShapesType= pools[0];
        // pools?.map((pool, index)=>{
        //   const temp =Math.sqrt(e.point.x * pool.position[0] + e.point.y * pool.position[1] + e.point.z * pool.position[2])
        //   if(temp<dist){
        //     dist=temp
        //     closestPool=pool
        //     setClosestPoolIndex(index)
        //   }})
        
        // find closest snap area according to type
        if(closestPool){
          switch (true) {
          case type==="SquareSteps" || type==="RoundSteps" || type==="Steps":
            const available = stairs.filter(stair => stair.used===false);
            if(available.length>0){
              let closest = available[0]
              setClosestIndex(0)
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
                if (temp < newdist) {
                  newdist = temp;
                  closest = stair;
                  
                  setClosestIndex(index)
                }
              });
              pointer  = {
                x:  closest.position[0],
                y:  closest.position[1],
                z:  closest.position[2],
              };
              setSnappingPosition(pointer) 
              pointer  = {
                x:  closestPool.position[0] +closest.position[0],
                y:  closestPool.position[1] +closest.position[1],
                z:   closestPool.position[2] +closest.position[2],
              };       
              
            }
              break;
          case type==="SwimJet":
            const availableSwimJet = swimJet.filter(obj => obj.used===false);
            if(availableSwimJet.length>0){
              let closest = availableSwimJet[0]
              setClosestIndex(0)
              let newdist = Math.sqrt(
                Math.pow(e.point.x - (closestPool.position[0] + availableSwimJet[0].position[0]), 2) +
                Math.pow(e.point.y - (closestPool.position[1] + availableSwimJet[0].position[1]), 2) +
                Math.pow(e.point.z - (closestPool.position[2] + availableSwimJet[0].position[2]), 2)
              );
              availableSwimJet.map((swimjet, index) => {
                const temp = Math.sqrt(
                  Math.pow(e.point.x - (closestPool.position[0] + swimjet.position[0]), 2) +
                  Math.pow(e.point.y - (closestPool.position[1] + swimjet.position[1]), 2) +
                  Math.pow(e.point.z - (closestPool.position[2] + swimjet.position[2]), 2)
                );
                if (temp < newdist) {
                  newdist = temp;
                  closest = swimjet;
                  
                  setClosestIndex(index)
                }
              });
              pointer  = {
                x:  closest.position[0],
                y:  closest.position[1],
                z:  closest.position[2],
              };
              setSnappingPosition(pointer) 
              pointer  = {
                x:  closestPool.position[0] +closest.position[0],
                y:  closestPool.position[1] +closest.position[1],
                z:   closestPool.position[2] +closest.position[2],
              };          
            }
            break;
          case type==="InfinityEdge":
            const availableInfinityEdge = infinityEdge.filter(obj => obj.used===false);
            if(availableInfinityEdge.length>0){
              let closest = availableInfinityEdge[0]
              setClosestIndex(0)
              let newdist = Math.sqrt(
                Math.pow(e.point.x - (closestPool.position[0] + availableInfinityEdge[0].position[0]), 2) +
                Math.pow(e.point.y - (closestPool.position[1] + availableInfinityEdge[0].position[1]), 2) +
                Math.pow(e.point.z - (closestPool.position[2] + availableInfinityEdge[0].position[2]), 2)
              );
              availableInfinityEdge.map((ifEdge, index) => {
                const temp = Math.sqrt(
                  Math.pow(e.point.x - (closestPool.position[0] + ifEdge.position[0]), 2) +
                  Math.pow(e.point.y - (closestPool.position[1] + ifEdge.position[1]), 2) +
                  Math.pow(e.point.z - (closestPool.position[2] + ifEdge.position[2]), 2)
                );
                if (temp < newdist) {
                  newdist = temp;
                  closest = ifEdge;
                  
                  setClosestIndex(index)
                }
              });
              pointer  = {
                x:  closest.position[0],
                y:  closest.position[1],
                z:  closest.position[2],
              };
              setSnappingPosition(pointer) 
              pointer  = {
                x:  closestPool.position[0] +closest.position[0],
                y:  closestPool.position[1] +closest.position[1],
                z:   closestPool.position[2] +closest.position[2],
              };          
            }
            break;
          case type==="Fountain" || type === "WallWaterfall" || type === "Waterblade":
            const availableFountain = fountain.filter(obj => obj.used===false);
            
          if(availableFountain.length>0){
              let closest = availableFountain[0]
              setClosestIndex(0)
              let newdist = Math.sqrt(
                Math.pow(e.point.x - (closestPool.position[0] + availableFountain[0].position[0]), 2) +
                Math.pow(e.point.y - (closestPool.position[1] + availableFountain[0].position[1]), 2) +
                Math.pow(e.point.z - (closestPool.position[2] + availableFountain[0].position[2]), 2)
              );
              availableFountain.map((fountain, index) => {
                const temp = Math.sqrt(
                  Math.pow(e.point.x - (closestPool.position[0] + fountain.position[0]), 2) +
                  Math.pow(e.point.y - (closestPool.position[1] + fountain.position[1]), 2) +
                  Math.pow(e.point.z - (closestPool.position[2] + fountain.position[2]), 2)
                );
                if (temp < newdist) {
                  newdist = temp;
                  closest = fountain;
                  
                  setClosestIndex(index)
                }
              });
              pointer  = {
                x:  closest.position[0],
                y:  closest.position[1],
                z:  closest.position[2],
              };
              setSnappingPosition(pointer) 
              pointer  = {
                x:  closestPool.position[0] +closest.position[0],
                y:  closestPool.position[1] +closest.position[1],
                z:   closestPool.position[2] +closest.position[2],
              };          
            }
            break;
          case type==="cornerRounded":
            const availableCorner = Corner.filter(obj => obj.used===false);
            if(availableCorner.length>0){
              let closest = availableCorner[0]
              setClosestIndex(0)
              let newdist = Math.sqrt(
                Math.pow(e.point.x - (closestPool.position[0] + availableCorner[0].position[0]), 2) +
                Math.pow(e.point.y - (closestPool.position[1] + availableCorner[0].position[1]), 2) +
                Math.pow(e.point.z - (closestPool.position[2] + availableCorner[0].position[2]), 2)
              );
              availableCorner.map((corner, index) => {
                const temp = Math.sqrt(
                  Math.pow(e.point.x - (closestPool.position[0] + corner.position[0]), 2) +
                  Math.pow(e.point.y - (closestPool.position[1] + corner.position[1]), 2) +
                  Math.pow(e.point.z - (closestPool.position[2] + corner.position[2]), 2)
                );
                if (temp < newdist) {
                  newdist = temp;
                  closest = corner;
                  
                  setClosestIndex(index)
                }
              });
              pointer  = {
                x:  closest.position[0],
                y:  closest.position[1],
                z:  closest.position[2],
              };
              setSnappingPosition(pointer) 
              pointer  = {
                x:  closestPool.position[0] +closest.position[0],
                y:  closestPool.position[1] +closest.position[1],
                z:   closestPool.position[2] +closest.position[2],
              };          
            }
            break;
          case type==="insetSteps" || type==="beachEntry":
           
          const availableBeach = beach.filter(obj => obj.used===false);  
          if(availableBeach.length>0){
              let closest = availableBeach[0]
              setClosestIndex(0)
              let newdist = Math.sqrt(
                Math.pow(e.point.x - (closestPool.position[0] + availableBeach[0].position[0]), 2) +
                Math.pow(e.point.y - (closestPool.position[1] + availableBeach[0].position[1]), 2) +
                Math.pow(e.point.z - (closestPool.position[2] + availableBeach[0].position[2]), 2)
              );
              availableBeach.map((beach, index) => {
                const temp = Math.sqrt(
                  Math.pow(e.point.x - (closestPool.position[0] + beach.position[0]), 2) +
                  Math.pow(e.point.y - (closestPool.position[1] + beach.position[1]), 2) +
                  Math.pow(e.point.z - (closestPool.position[2] + beach.position[2]), 2)
                );
                if (temp < newdist) {
                  newdist = temp;
                  closest = beach;
                  
                  setClosestIndex(index)
                }
              });
              pointer  = {
                x:  closest.position[0],
                y:  closest.position[1],
                z:  closest.position[2],
              };
              setSnappingPosition(pointer) 
              pointer  = {
                x:  closestPool.position[0] +closest.position[0],
                y:  closestPool.position[1] +closest.position[1],
                z:   closestPool.position[2] +closest.position[2],
              };          
            }
            break;
          }
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
          // dispatch(addPool({shapeType:type, position:[coords.x,coords.y,coords.z], scale:[1,1,1]}))
          dispatch(addNewPool({poolType:type, width:16, height:5, depth:12, position:[e.point.x,e.point.y,e.point.z], scale:[1,1,1],childrens:[]}))
          break;
        case "poolWithSteps":
          dispatch(addNewPool({poolType:type, width:16, height:5, depth:12, position:[e.point.x,e.point.y,e.point.z], scale:[1,1,1],childrens:[]}))
          break;
        case "L-Shape":
          dispatch(addNewPool({poolType:type, width:16, height:5, depth:12, position:[e.point.x,e.point.y,e.point.z], scale:[1,1,1],childrens:[]}))
          break;
        case "cyl":
          dispatch(addNewPool({poolType:type, width:16, height:5, depth:12, position:[e.point.x,e.point.y,e.point.z], scale:[1,1,1],childrens:[]}))
          break;

          case "SwimJet":
            if(SnappingPosition){
              // const temp = stairs
              // temp[ClosestIndex].used = true;
             
              let rotation=0
              let position=[0,0,0]
              switch (ClosestIndex) {
                case 0:
                  //left
                  rotation = Math.PI/2 // 90
                  position[0]= -.3
                  break;
                case 1:
                  //right
                  rotation = -Math.PI/2 //-90
                  position[0]= .3
                  break;
                case 2:
                  rotation = 0 //-90
                  position[2]= -.3
                  break;
                  case 3:
                  rotation = Math.PI //-90
                  position[2]= .3
                  break;
              
                default:
                  break;
              }
              // setswimJet(temp)
              dispatch(addChildren({poolIndex:ClosestPoolIndex,children:{shapeType:type,rotation:[0, rotation, 0],position:[SnappingPosition.x+position[0],SnappingPosition.y,SnappingPosition.z+position[2]], scale:[3,3,3]}}))
            }
            break;
          case "WallWaterfall":
            if(SnappingPosition){
              // const temp = fountain
              // temp[ClosestIndex].used = true;
              // setfountain(temp)
              let rotation=0
              let position=[0,-.4,0]
              switch (ClosestIndex) {
                case 0:
                  //left
                  rotation = Math.PI/2 // 90
                  position[0]= -.32
                  break;
                case 1:
                  //right
                  rotation = -Math.PI/2 //-90
                  position[0]= .32
                  break;
                case 2:
                  rotation = 0 //-90
                  position[2]= -.32
                  break;
                  case 3:
                  rotation = Math.PI //-90
                  position[2]= .32
                  break;
              
                default:
                  break;
              }
              dispatch(addChildren({poolIndex:ClosestPoolIndex,children:{shapeType:type, rotation:[0, rotation, 0], position:[SnappingPosition.x+position[0],SnappingPosition.y+position[1],SnappingPosition.z+position[2]], scale:[1,1,1]}}))
            }
            break;
          case "Waterblade":
            if(SnappingPosition){
              // const temp = fountain
              // temp[ClosestIndex].used = true;
              // setfountain(temp)
              let rotation=0
              let position=[0,-.4,0]
              switch (ClosestIndex) {
                case 0:
                  //left
                  rotation = Math.PI/2 // 90
                  position[0]= -.2
                  break;
                case 1:
                  //right
                  rotation = -Math.PI/2 //-90
                  position[0]= 0.2
                  break;
                case 2:
                  rotation = 0 //-90
                  position[2]=-0.2
                  break;
                  case 3:
                  rotation = Math.PI //-90
                  position[2]= 0.2
                  break;
              
                default:
                  break;
              }
              dispatch(addChildren({poolIndex:ClosestPoolIndex,children:{shapeType:type, rotation:[0, rotation, 0], position:[SnappingPosition.x+position[0],SnappingPosition.y+position[1],SnappingPosition.z+position[2]], scale:[1,1,1]}}))
            }
            break;
          case "Steps": // will be replaced
            if(SnappingPosition){
            // const temp = stairs
            // temp[ClosestIndex].used = true;
            // setstairs(temp)
            let rotation=0
              let position=[0,0,0]
              let side =sides.Left
              switch (ClosestIndex) {
                case 0:
                  //left
                  rotation =0 // 90
                  position[0]=0
                  side=sides.Left
                  break;
                case 1:
                  //right
                  rotation = 0 //-90
                  position[0]=0
                  side=sides.Right
                  break;
                case 2:
                  rotation = 0 //180
                  position[2]= 0
                  side=sides.Top
                  break;
                  case 3:
                  rotation = 0 //0
                  position[2]= 0
                  side=sides.Bottom
                  break;
              
                default:
                  break;
              }
              dispatch(addChildren({poolIndex:ClosestPoolIndex,children:{shapeType:type, side:side,rotation:[0, rotation, 0], position:[SnappingPosition.x+position[0],SnappingPosition.y + position[1],SnappingPosition.z+position[2]], scale:[1,1,1]}}))
          }
            break;
          case "cornerRounded":
            if(SnappingPosition){
              // const temp = Corner
              // temp[ClosestIndex].used = true;
              // setCorner(temp)
              let rotation=0
              let position=[0,-cornerHeight/2,0]
              let side =sides.Left
              switch (ClosestIndex) {
                case 0:
                  //Topleft
                  rotation = 0
                  position[0]= -boxWidth/2
                  position[2]= -boxWidth/2
                  side=sides.Left
                  break;
                  case 1:
                    //Top right
                    rotation = -Math.PI/2 //-90
                    position[0]= boxWidth/2
                    position[2]= -boxWidth/2
                    side=sides.Right
                    break;
                    case 2:
                      //bottom Left
                      rotation = Math.PI/2 //-90
                      position[2]= boxWidth/2
                      position[0]= -boxWidth/2
                      side=sides.Top
                      break;
                      case 3:
                        //bottom Right
                        rotation = -Math.PI  //-90
                        position[2]= boxWidth/2
                        position[0]= boxWidth/2
                        side=sides.Bottom
                  break;
              
                default:
                  break;
              }
              dispatch(addChildren({poolIndex:ClosestPoolIndex,children:{shapeType:type,rotation:[0, rotation, 0], position:[SnappingPosition.x+position[0],SnappingPosition.y+position[1],SnappingPosition.z+position[2]],side:side, scale:[1,1,1]}}))
            }
            break;
          case "InfinityEdge":
            if(SnappingPosition){
              // const temp = infinityEdge
              // temp[ClosestIndex].used = true;
              // setinfinityEdge(temp)
              let rotation=0
              let position=[0,0,0]
              switch (ClosestIndex) {
                case 0:
                  //left
                  rotation = -Math.PI/2 // 90
                  position[0]= -.55
                  break;
                case 1:
                  //right
                  rotation = Math.PI/2 //-90
                  position[0]= .55
                  break;
                case 2:
                  rotation = Math.PI //180
                  position[2]= -.55
                  break;
                  case 3:
                  rotation = 0 //0
                  position[2]= .55
                  break;
              
                default:
                  break;
              }
              dispatch(addChildren({poolIndex:ClosestPoolIndex,children:{shapeType:type,rotation:[0, rotation, 0],position:[SnappingPosition.x+position[0],SnappingPosition.y-1.78,SnappingPosition.z+position[2]], scale:[1,1,1]}}))
            }
            break;
          case "Fountain":
            if(SnappingPosition){
              // const temp = fountain
              // temp[ClosestIndex].used = true;
              // setfountain(temp)
              let rotation=0
              let position=[0,-.46,0]
              switch (ClosestIndex) {
                case 0:
                  //left
                  rotation = Math.PI/2 // 90
                  position[0]= -.1
                  break;
                case 1:
                  //right
                  rotation = -Math.PI/2 //-90
                  position[0]= .1
                  break;
                case 2:
                  rotation = 0 //180
                  position[2]= -.1
                  break;
                  case 3:
                  rotation = Math.PI //0
                  position[2]= .1
                  break;
              
                default:
                  break;
              }
              dispatch(addChildren({poolIndex:ClosestPoolIndex,children:{shapeType:type,rotation:[0, rotation, 0], position:[SnappingPosition.x+position[0],SnappingPosition.y+position[1],SnappingPosition.z+position[2]], scale:[1,1,1]}}))
            }
            break;
          case "SquareSteps":
            if(SnappingPosition){
              // const temp = stairs
              // temp[ClosestIndex].used = true;
              // setstairs(temp)
              let rotation=0
              let position=[0,.2,0]
              let side =sides.Left
              switch (ClosestIndex) {
                case 0:
                  //left
                  rotation =0 // 90
                  position[0]=1.3
                  side=sides.Left
                  break;
                case 1:
                  //right
                  rotation = 0 //-90
                  position[0]=-1.3
                  side=sides.Right
                  break;
                case 2:
                  rotation = 0 //180
                  position[2]= 0
                  side=sides.Top
                  break;
                  case 3:
                  rotation = 0 //0
                  position[2]= 0
                  side=sides.Bottom
                  break;
              
                default:
                  break;
              }
              dispatch(addChildren({poolIndex:ClosestPoolIndex,children:{shapeType:type, side:side,rotation:[0, 0, 0], position:[SnappingPosition.x+position[0],SnappingPosition.y + position[1],SnappingPosition.z+position[2]], scale:[1,1,1]}}))
            }
            break;
          case "RoundSteps":
            if(SnappingPosition){
              // const temp = stairs
              // temp[ClosestIndex].used = true;
              // setstairs(temp)
              let rotation=0
              let position=[0,.2,0]
              let side =sides.Left
              switch (ClosestIndex) {
                case 0:
                  //left
                  rotation = Math.PI/2 // 90
                  position[0]=-1.9
                  side=sides.Left
                  break;
                case 1:
                  //right
                  rotation = -Math.PI/2 //-90
                  position[0]=1.9
                  side=sides.Right
                  break;
                case 2:
                  rotation = 0 //180
                  position[2]= -1.9
                  side=sides.Top
                  break;
                  case 3:
                  rotation = Math.PI //0
                  position[2]= 1.9
                  side=sides.Bottom
                  break;
              
                default:
                  break;
              }
              dispatch(addChildren({poolIndex:ClosestPoolIndex,children:{shapeType:type, side:side,rotation:[0, rotation, 0], position:[SnappingPosition.x+position[0],SnappingPosition.y + position[1],SnappingPosition.z+position[2]], scale:[1,1,1]}}))
            }
            break;
          case "insetSteps":
            if(SnappingPosition){
              // const temp = beach
              // temp[ClosestIndex].used = true;
              // setbeach(temp)
              let rotation=0
              let position=[0,-0.86,0]
              switch (ClosestIndex) {
                case 0:
                  //left
                  rotation = Math.PI/2 // 90
                  position[0]= 1.6
                  break;
                case 1:
                  //right
                  rotation = -Math.PI/2 //-90
                  position[0]= -1.6
                  break;
                case 2:
                  rotation = 0 //180
                  position[2]= 1.6
                  break;
                  case 3:
                  rotation = Math.PI //0
                  position[2]= -1.6
                  break;
              
                default:
                  break;
              }
              dispatch(addChildren({poolIndex:ClosestPoolIndex,children:{shapeType:type, rotation:[0, rotation, 0], position:[SnappingPosition.x+position[0],SnappingPosition.y+position[1],SnappingPosition.z+position[2]], scale:[1,1,1]}}))
            }
            break;
      }
    }
  }
  // ------- //


  {/* Floor */}
  return (

    <mesh onClick={(e)=>{
      if(visibility)
        dispatch(setPivotVisibility(false));
        }} rotation={[-Math.PI / 2, 0, 0]} renderOrder={1} position={[0, 0, 0]} onPointerUp={(e)=>OnPointerUpHandler(e)} onPointerMove={(e)=>OnPointerMoveHandler(e)}>
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial {...stencil} color={"#fff"}/>

    </mesh>
)};
