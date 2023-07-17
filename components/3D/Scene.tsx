"use client";
import React, { useRef } from "react";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Environment from "../Environment";
import { Perf } from "r3f-perf";
import Ground from "./Ground/Ground";
import Helper from "./Helpers/Helper";
import { useAppSelector } from "@/store/hooks";
import { selectPools, selectShapes } from "@/slices/shapesSlice";
import { selectPools as selectAllPools } from "@/slices/poolsSlice";
import * as THREE from "three"
import Pool from "./Models/Pool/Pool";
import SwimJet from "./Models/SwimJet";
import WallWaterfall from "./Models/WallWaterfall";
import Waterblade from "./Models/Waterblade/Waterblade";
import Steps from "./Models/Steps";
import InfinityEdge from "./Models/InfinityEdge";
import Fountain from "./Models/Fountain";
import SquareSteps from "./Models/squareSteps";
import { InsetSteps } from "./Models/insetSteps/InsetSteps";
import CornerRoundSteps from "./Models/CornerRoundSteps";
import RoundSteps from "./Models/RoundSteps";
import { RootState } from "@/store/store";
type Props = {
};
enum sides{
  Top = "Top",
  Bottom= "Bottom",
  Left = "Left",
  Right = "Right",
}
export default function Scene({}: Props) {
  const cameraRef = useRef<any>(null)
  const shapes = useAppSelector(selectShapes)
  const pools = useAppSelector(selectPools)
  const Pools = useAppSelector(selectAllPools)
  const defaults = useAppSelector((state:RootState)=>state.defaults)

  const poolwidth=defaults.pool.width
  const poolheight=defaults.pool.height
  const pooldepth=defaults.pool.depth
  return (
    <Canvas>
      <Perf position={"bottom-right"}/>
      <PerspectiveCamera ref={cameraRef} makeDefault={true} position={[0, 1, 2]} />
      <OrbitControls makeDefault maxPolarAngle={Math.PI / 2} />
      <Environment />
      <Ground />
      <Helper/>
      {/* {pools.map((shape, index)=>{
        switch (shape.shapeType) {
          case "pool":
            return(
              <Pool key={index} width={16} height={5} depth={12} scale={shape.scale} position={shape.position}/> )
          case "poolWithSteps":
            return (
              <Pool key={index} width={16} height={5} depth={12} scale={shape.scale} position={shape.position}/> 
            )
          case "L-Shape":
            return(
              <Pool key={index} scale={shape.scale} position={shape.position}/> 
            )
        }
      })}
      {pools.length>0 && shapes.map((shape, index)=>{
        switch (shape.shapeType) {
          // case "pool":
          //   return(
          //     <Pool key={index} width={16} height={5} depth={12} scale={shape.scale} position={shape.position}/> 
          //   // <mesh renderOrder={0} position={new THREE.Vector3(...shape.position)} scale={new THREE.Vector3(...shape.scale)}>
          //   //   <boxGeometry args={[4,3,3]}/>
          //   //   <meshBasicMaterial color={"red"} transparent opacity={.7}/>
          //   // </mesh>
          //   )
          // case "poolWithSteps":
          //   return (
          //     <Pool key={index} width={16} height={5} depth={12} scale={shape.scale} position={shape.position}/> 
          //   )
          // case "L-Shape":
          //   return(
          //     <Pool key={index} scale={shape.scale} position={shape.position}/> 
          //   )
          case "SwimJet":
            return(
              <SwimJet key={index} scale={new THREE.Vector3(...shape.scale)} position={new THREE.Vector3(...shape.position)}/> 
            )
          case "WallWaterfall":
            return(
              <WallWaterfall key={index} scale={new THREE.Vector3(...shape.scale)} position={new THREE.Vector3(...shape.position)}/> 
            )
          case "Waterblade":
            return(
              <Waterblade key={index} scale={new THREE.Vector3(...shape.scale)} position={new THREE.Vector3(...shape.position)}/> 
            )
          case "Steps":
            return(
              <Steps key={index} position={new THREE.Vector3(...shape.position)} steps={5} width={4} depthPerStep={1} intersecting={false} poolWidth={5} poolHeight={5} poolOutline={.5} /> 
            )
          case "cornerRounded":
            return(
              <CornerRoundSteps key={index} position={[shape.position[0], shape.position[1], shape.position[2]]} /> 
            )
          case "InfinityEdge":
            return(
              <InfinityEdge key={index} scale={new THREE.Vector3(...shape.scale)} position={new THREE.Vector3(...shape.position)} /> 
            )
          case "Fountain":
            return(
              <Fountain key={index} scale={new THREE.Vector3(...shape.scale)} position={new THREE.Vector3(...shape.position)} /> 
            )
          case "SquareSteps":
            return(
              <SquareSteps gap={.8} key={index} position={new THREE.Vector3(...shape.position)} steps={5} width={3} intersecting={false} poolHeight={5} poolWidth={16} /> 
            )
          case "insetSteps":
            return(
              <InsetSteps key={index} position={new THREE.Vector3(...shape.position)} /> 
            )
        }
      })} */}

       {Pools.map((pool, poolIndex)=>{
        switch (pool.poolType) {
          case "pool":
            return(
              <Pool key={poolIndex} pool={pool} index={poolIndex} width={pool.width} height={pool.height} depth={pool.depth} scale={pool.scale} position={pool.position} sPosition={pool.sPosition} sRotation={pool.sRotation} rotation={pool.rotation} sScale={pool.rotation} sWidth={pool.sWidth} sHeight={pool.sHeight} sDepth={pool.sDepth}>
                  {pool.childrens.length>0 && pool.childrens.map((shape, index)=>{
                      switch (shape.shapeType) {
                        case "SwimJet":
                          return(
                            <SwimJet key={index} rotation={new THREE.Euler(...shape.rotation)} scale={new THREE.Vector3(...shape.scale)} position={new THREE.Vector3(...shape.position)}/> 
                          )
                        case "WallWaterfall":
                          return(
                            <WallWaterfall key={index} rotation={new THREE.Euler(...shape.rotation)} scale={new THREE.Vector3(...shape.scale)} position={new THREE.Vector3(...shape.position)}/> 
                          )
                        case "Waterblade":
                          return(
                            <Waterblade key={index} rotation={new THREE.Euler(...shape.rotation)} scale={new THREE.Vector3(...shape.scale)} position={new THREE.Vector3(...shape.position)}/> 
                          )
                        case "Steps":
                          return(
                            <Steps rotation={new THREE.Euler(...shape.rotation)} scale={new THREE.Vector3(...shape.scale)} key={index} position={new THREE.Vector3(...shape.position)} width={3} poolHeight={pool.height} poolWidth={pool.width} side={shape.side} heightPerStep={.63} gap={0.8} poolDepth={pool.depth} intersecting={false} /> 
                          )
                        case "cornerRounded":
                          return(
                            <CornerRoundSteps key={index} rotation={new THREE.Euler(...shape.rotation)} scale={new THREE.Vector3(...shape.scale)} position={new THREE.Vector3(...shape.position)} width={3} poolHeight={pool.height} poolWidth={pool.width} side={shape.side} heightPerStep={.63} gap={0.8}  /> 
                          )
                        case "RoundSteps":
                          return(
                            <RoundSteps key={index} rotation={new THREE.Euler(...shape.rotation)} scale={new THREE.Vector3(...shape.scale)} position={new THREE.Vector3(...shape.position)} width={3} poolHeight={pool.height} poolWidth={pool.width} side={shape.side} heightPerStep={.63} gap={0.8}  /> 
                          )
                        case "InfinityEdge":
                          return(
                            <InfinityEdge poolWidth={pool.width} poolHeight={pool.height} poolDepth={pool.depth} key={index} rotation={new THREE.Euler(...shape.rotation)} scale={new THREE.Vector3(...shape.scale)} position={new THREE.Vector3(...shape.position)} /> 
                          )
                        case "Fountain":
                          return(
                            <Fountain key={index} rotation={new THREE.Euler(...shape.rotation)} scale={new THREE.Vector3(...shape.scale)} position={new THREE.Vector3(...shape.position)} /> 
                          )
                        case "SquareSteps":
                          return(
                            <SquareSteps gap={.8} key={index} rotation={new THREE.Euler(...shape.rotation)} scale={new THREE.Vector3(...shape.scale)} position={new THREE.Vector3(...shape.position)} width={3} intersecting={false} poolHeight={pool.height} poolWidth={pool.width} side={shape.side} heightPerStep={.7} /> 
                          )
                        case "insetSteps":
                          return(
                            <InsetSteps key={index} rotation={new THREE.Euler(...shape.rotation)} scale={new THREE.Vector3(...shape.scale)} position={new THREE.Vector3(...shape.position)} /> 
                          )
                      }
                    })}

              </Pool> 
              
              )
        }
      })}
      
    </Canvas>
  );
}

export const MemoisedScene = React.memo(Scene)