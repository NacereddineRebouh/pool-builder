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
import { CornerRoundSteps } from "./Models/RoundSteps/CornerRoundSteps";
type Props = {
};

export default function Scene({}: Props) {
  const cameraRef = useRef<any>(null)
  const shapes = useAppSelector(selectShapes)
  const pools = useAppSelector(selectPools)
  const Pools = useAppSelector(selectAllPools)

  return (
    <Canvas>
      <Perf />
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

       {Pools.map((pool, index)=>{
        switch (pool.poolType) {
          case "pool":
            return(
              <Pool key={index} index={index} width={pool.width} height={pool.height} depth={pool.depth} scale={pool.scale} position={pool.position}>
                  {Pools.length>0 && shapes.map((shape, index)=>{
                      switch (shape.shapeType) {
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
                            <Steps key={index} position={new THREE.Vector3(...shape.position)} steps={5} width={4} depthPerStep={1} intersecting={false}              poolWidth={5} poolHeight={5} poolOutline={.5} /> 
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
                            <SquareSteps gap={.8} key={index} position={new THREE.Vector3(...shape.position)} steps={5} width={3} intersecting={false}              poolHeight={5} poolWidth={16} /> 
                          )
                        case "insetSteps":
                          return(
                            <InsetSteps key={index} position={new THREE.Vector3(...shape.position)} /> 
                          )
                      }
                    })}

              </Pool> 
              
              )
              // <Pool key={index} width={16} height={5} depth={12} scale={pool.scale} position={pool.position}/> )
          // case "poolWithSteps":
          //   return (
          //     <Pool key={index} width={16} height={5} depth={12} scale={pool.scale} position={pool.position}/> 
          //   )
          // case "L-Shape":
          //   return(
          //     <Pool key={index} scale={pool.scale} position={pool.position}/> 
          //   )
        }
      })}
      
    </Canvas>
  );
}

export const MemoisedScene = React.memo(Scene)