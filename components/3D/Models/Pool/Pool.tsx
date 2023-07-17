"use client"
import React, { FC, useRef } from "react";
import * as THREE from "three";
import {
  Mask,
  useTexture,
} from "@react-three/drei";
import Borders from "./Borders";
import { selectPivotVisibility, selectTarget, setPivotVisibility, setTarget } from "@/slices/targetSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { PivotControls } from "@/components/UI/pivotControls";
import { ReplacePool } from "@/slices/poolsSlice";
interface Props {
  index?: number;
  position: number[];
  sPosition: number[];
  sRotation: number[];
  rotation: number[];
  scale: number[];
  sScale: number[];
  width: number;
  sWidth: number;
  height: number;
  sHeight: number;
  depth: number;
  sDepth: number;
  key?: number;
  children?: React.ReactNode;
  pool:PoolType;
}
enum sides{
  Top = "Top",
  Bottom= "Bottom",
  Left = "Left",
  Right = "Right",
}
export interface ChildrensType {
  shapeType: string;
  position: number[];
  sPosition: number[];
  sRotation: number[];
  rotation: number[];
  scale: number[];
  sScale: number[];
  width: number;
  sWidth: number;
  height: number;
  sHeight: number;
  depth: number;
  sDepth: number;
  side: sides;
}
export interface PoolType {
  poolType: string;
  position: number[];
  sPosition: number[];
  sRotation: number[];
  rotation: number[];
  scale: number[];
  sScale: number[];
  width: number;
  sWidth: number;
  height: number;
  sHeight: number;
  depth: number;
  sDepth: number;
  childrens:ChildrensType[]
}
const Pool: FC<Props> = ({width=16, height=5,depth=12, position,sPosition, scale, sScale, sRotation, index, children,pool}) => {
  // load tile texture
  const texture = useTexture("/textures/tiles.jpg");
  texture.wrapT = THREE.RepeatWrapping;
  texture.wrapS = THREE.RepeatWrapping;
  texture.repeat.set(1,1/2)
  const groupRef = useRef<THREE.Group>(null)
  const dispatch = useAppDispatch();
  const target = useAppSelector(selectTarget);
  const visible = useAppSelector(selectPivotVisibility);

  // Snapping box 
  const boxWidth = 3
  const boxHeight = height
  const boxDepth = 4

  const swimJetBoxWidth = 3/3
  const swimJetBoxHeight = height/3
  const swimJetBoxDepth = 4/3

  const infinityEdgeBoxWidth = 1
  const infinityEdgeBoxHeight = 1
  const infinityEdgeBoxDepth = depth

  const waterFallBoxWidth = 3
  const waterFallBoxHeight = 2
  const waterFallBoxDepth = 2
  
  return (
    <PivotControls
     disableScaleAxes
     snapTranslate={10}
     visible={visible&& target?.uuid===groupRef.current?.uuid}
     displayValues
     scale={visible && target?.uuid===groupRef.current?.uuid ?75:0}
     depthTest={false}
     fixed
     onDragEnd={(w)=>{
      var vec = new THREE.Vector3();
      vec.setFromMatrixPosition(w);
      console.log(vec)
      const pl = {...pool}
      pl.sPosition=[vec.x, vec.y, vec.z]
      dispatch(ReplacePool({poolIndex:index, pool:pl}))

    }}
     offset={[groupRef.current? groupRef.current.position.x : position[0]+0 , groupRef.current? groupRef.current.position.y : position[1]+0 ,groupRef.current? groupRef.current.position.z : position[2]+0]}
     lineWidth={2}>
      <group ref={groupRef} scale={new THREE.Vector3(...scale)} position={new THREE.Vector3(position[0],position[1],position[2])} onClick={(e)=>{
    // console.log(target?.uuid,"::::",groupRef?.current?.uuid)
    dispatch(setPivotVisibility(true))
    if(target?.uuid!=groupRef?.current?.uuid){
     dispatch(setTarget(groupRef.current))
   }
 }}>
    {/* Pool */}
      <mesh position={[0,-height/2+.1,0]}>
      <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          metalness={0.2}
          roughness={0.24}
          map={texture}
          attach={"material-0"}
          side={2}
          color={"lightblue"}
        /> 
        <meshStandardMaterial
          metalness={0.2}
          roughness={0.24}
          map={texture}
          attach={"material-1"}
          side={2}
          color={"lightblue"}
        /> 
        <meshStandardMaterial
          metalness={0.2}
          roughness={0.24}
          map={texture}
          attach={"material-3"}
          side={2}
          color={"lightblue"}
        /> 
        <meshStandardMaterial
          metalness={0.2}
          roughness={0.24}
          map={texture}
          attach={"material-4"}
          side={2}
          color={"lightblue"}
        /> 
        <meshStandardMaterial
          metalness={0.2}
          roughness={0.24}
          map={texture}
          attach={"material-5"}
          side={2}
          color={"lightblue"}
        /> 
        <meshStandardMaterial
          metalness={0.2}
          roughness={0.24}
          map={texture}
          attach={"material-2"}
          side={1}
          colorWrite={false}
          color={"lightblue"}
          // transparent
          // opacity={0}
        /> 
      </mesh>
 
      {/* Mask */}
      <Mask id={1} rotation={[-Math.PI/2,0,0]} position={[0, .5, 0]}>
      <planeGeometry args={[width, depth]} />
      {/* <meshBasicMaterial color={"salmon"}/> */}
      </Mask>
 
      {/* Borders */}
      <Borders width={width} height={.5} depth={height} outline={2} position={new THREE.Vector3(0,0,0)} side={"left"} poolWidth={width}   poolDepth={depth}/>
      <Borders width={width} height={.5} depth={height} outline={2} position={new THREE.Vector3(0,0,0)} side={"top"} poolWidth={width}  poolDepth={depth}/>
      <Borders width={width} height={.5} depth={height} outline={2} position={new THREE.Vector3(0,0,0)} side={"bottom"} poolWidth={width}   poolDepth={depth}/>
      <Borders width={width} height={.5} depth={height} outline={2} position={new THREE.Vector3(0,0,0)} side={"right"} poolWidth={width}  poolDepth={depth}/>
      
      {
        
      }
      {/* ------------------- Snapping areas " stairs helper boxes "  ---------------- */}
        {/* #left */}
        <mesh visible={false} position={[-width/2+boxWidth/2,-height+boxHeight/2,0]}>
          <boxGeometry args={[boxWidth, boxDepth, boxHeight]}/>
          <meshBasicMaterial transparent opacity={.7} color={"green"}/>
        </mesh>
        {/* #right */}
        <mesh visible={false} position={[width/2-boxWidth/2,-height+boxHeight/2,0]}>
          <boxGeometry args={[boxWidth, boxDepth, boxHeight]}/>
          <meshBasicMaterial transparent opacity={.7} color={"green"}/>
        </mesh>
        {/* #top */}
        <mesh visible={false} rotation={[0,Math.PI/2,0]} position={[0,-height+boxHeight/2,-depth/2+boxWidth/2]}>
          <boxGeometry args={[boxWidth, boxDepth, boxHeight]}/>
          <meshBasicMaterial transparent opacity={.7} color={"green"}/>
        </mesh>
        {/* #bottom */}
        <mesh visible={false} rotation={[0,Math.PI/2,0]} position={[0,-height+boxHeight/2,depth/2-boxWidth/2]}>
          <boxGeometry args={[boxWidth, boxDepth, boxHeight]}/>
          <meshBasicMaterial transparent opacity={.7} color={"green"}/>
        </mesh>

      {/* ------------------- Snapping areas " swimJet "  ---------------- */}
        {/* #left */}
        <mesh visible={false} position={[-width/2+swimJetBoxWidth/2,-height/2+swimJetBoxHeight/2,0]}>
          <boxGeometry args={[swimJetBoxWidth, swimJetBoxDepth, swimJetBoxHeight]}/>
          <meshBasicMaterial transparent opacity={.7} color={"green"}/>
        </mesh>
        {/* #right */}
        <mesh visible={false} position={[width/2-swimJetBoxWidth/2,-height/2+swimJetBoxHeight/2,0]}>
          <boxGeometry args={[swimJetBoxWidth, swimJetBoxDepth, swimJetBoxHeight]}/>
          <meshBasicMaterial transparent opacity={.7} color={"green"}/>
        </mesh>
        {/* #top */}
        <mesh visible={false} rotation={[0,Math.PI/2,0]} position={[0,-height/2+swimJetBoxHeight/2,-depth/2+swimJetBoxWidth/2]}>
          <boxGeometry args={[swimJetBoxWidth, swimJetBoxDepth, swimJetBoxHeight]}/>
          <meshBasicMaterial transparent opacity={.7} color={"green"}/>
        </mesh>
        {/* #bottom */}
        <mesh visible={false} rotation={[0,Math.PI/2,0]} position={[0,-height/2+swimJetBoxHeight/2,depth/2-swimJetBoxWidth/2]}>
          <boxGeometry args={[swimJetBoxWidth, swimJetBoxDepth, swimJetBoxHeight]}/>
          <meshBasicMaterial transparent opacity={.7} color={"green"}/>
        </mesh>

      {/* ------------------- Snapping areas " infinityEdge "  ---------------- */}
        {/* #left */}
        <mesh visible={false} position={[-width/2-infinityEdgeBoxWidth,infinityEdgeBoxHeight/2,0]}>
          <boxGeometry args={[1, infinityEdgeBoxHeight, infinityEdgeBoxDepth]}/>
          <meshBasicMaterial transparent opacity={.7} color={"green"}/>
        </mesh>
        {/* #right */}
        <mesh visible={false} position={[width/2+infinityEdgeBoxWidth,infinityEdgeBoxHeight/2,0]}>
          <boxGeometry args={[1, infinityEdgeBoxHeight, infinityEdgeBoxDepth]}/>  
          <meshBasicMaterial transparent opacity={.7} color={"green"}/>
        </mesh>
        {/* #top */}
        <mesh visible={false} rotation={[0,0,0]} position={[0,infinityEdgeBoxHeight/2,-depth/2-infinityEdgeBoxWidth]}>
          <boxGeometry args={[width, infinityEdgeBoxHeight, 1]}/>
          <meshBasicMaterial transparent opacity={.7} color={"green"}/>
        </mesh>
        {/* #bottom */}
        <mesh visible={false} rotation={[0,0,0]} position={[0,infinityEdgeBoxHeight/2,depth/2+infinityEdgeBoxWidth]}>
          <boxGeometry args={[width, infinityEdgeBoxHeight, 1]}/>
          <meshBasicMaterial transparent opacity={.7} color={"green"}/>
        </mesh>
      {/* ------------------- Snapping areas " fountain && Water fall&blade "  ---------------- */}
        {/* #left */}
        <mesh visible={false} rotation={[0,Math.PI/2,0]} position={[-width/2-waterFallBoxWidth,waterFallBoxHeight/2,0]}>
          <boxGeometry args={[waterFallBoxWidth, waterFallBoxHeight, waterFallBoxDepth]}/>
          <meshBasicMaterial transparent opacity={.7} color={"green"}/>
        </mesh>
        {/* #right */}
        <mesh visible={false} rotation={[0,Math.PI/2,0]} position={[width/2+waterFallBoxWidth,waterFallBoxHeight/2,0]}>
          <boxGeometry args={[waterFallBoxWidth, waterFallBoxHeight, waterFallBoxDepth]}/>  
          <meshBasicMaterial transparent opacity={.7} color={"green"}/>
        </mesh>
        {/* #top */}
        <mesh visible={false} position={[0,waterFallBoxHeight/2,-depth/2-waterFallBoxWidth]}>
          <boxGeometry args={[waterFallBoxWidth, waterFallBoxHeight, waterFallBoxDepth]}/>
          <meshBasicMaterial transparent opacity={.7} color={"green"}/>
        </mesh>
        {/* #bottom */}
        <mesh visible={false} position={[0,waterFallBoxHeight/2,depth/2+waterFallBoxWidth]}>
          <boxGeometry args={[waterFallBoxWidth, waterFallBoxHeight, waterFallBoxDepth]}/>
          <meshBasicMaterial transparent opacity={.7} color={"green"}/>
        </mesh>
      {/* ------------------- Snapping areas " Corner Steps "  ---------------- */}
       {/* #Topleft */}
       <mesh visible={false} position={[-width/2+3/2, -height+4/2, -depth/2+3/2]}>
          <boxGeometry args={[3, 4, 3]}/>
          <meshBasicMaterial transparent opacity={.7} color={"green"}/>
        </mesh>
        {/* #TopRight */}
        <mesh visible={false} position={[width/2-3/2,-height+4/2,-depth/2+3/2]}>
          <boxGeometry args={[3, 4, 3]}/>
          <meshBasicMaterial transparent opacity={.7} color={"green"}/>
        </mesh>
        {/* #Bottomleft */}
        <mesh visible={false} rotation={[0,Math.PI/2,0]} position={[-width/2+3/2,-height+4/2,depth/2-3/2]}>
          <boxGeometry args={[3, 4, 3]}/>
          <meshBasicMaterial transparent opacity={.7} color={"green"}/>
        </mesh>
        {/* #BottomRight */}
        <mesh visible={false} rotation={[0,Math.PI/2,0]} position={[width/2-3/2,-height+4/2,depth/2-3/2]}>
          <boxGeometry args={[3, 4, 3]}/>
          <meshBasicMaterial transparent opacity={.7} color={"green"}/>
        </mesh>

      {/* ------------------- Snapping areas " beach entry & insetSteps "  ---------------- */}
        {/* #left */}
        <mesh visible={false} rotation={[0,Math.PI/2,0]} position={[-width/2-2,2/2,0]}>
          <boxGeometry args={[8, 2, 2]}/>
          <meshBasicMaterial transparent opacity={.7} color={"green"}/>
        </mesh>
        {/* #right */}
        <mesh visible={false} rotation={[0,Math.PI/2,0]} position={[width/2+2,2/2,0]}>
          <boxGeometry args={[8, 2, 2]}/>  
          <meshBasicMaterial transparent opacity={.7} color={"green"}/>
        </mesh>
        {/* #top */}
        <mesh visible={false} position={[0,2/2,-depth/2-2]}>
          <boxGeometry args={[8, 2, 2]}/>
          <meshBasicMaterial transparent opacity={.7} color={"green"}/>
        </mesh>
        {/* #bottom */}
        <mesh visible={false} position={[0,2/2,depth/2+2]}>
          <boxGeometry args={[8, 2, 2]}/>
          <meshBasicMaterial transparent opacity={.7} color={"green"}/>
        </mesh>



        {/* Childrens */}
        {children}
      </group>
  </PivotControls>
  );
};

export default Pool;
